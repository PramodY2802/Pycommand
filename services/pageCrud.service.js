import * as allModels from "../models/index.js";
import { logger } from "../config/logger.js";
import { createAuditLog } from "./auditLog.service.js";
import { PAGE_CRUD_AUDIT_MESSAGES } from "../constant/auditLog.constants.js";
import bcrypt from "bcrypt";

const { FieldConfiguration } = allModels;

const hasAttribute = (Model, field) => Boolean(Model?.rawAttributes?.[field]);

const getPrimaryKeyField = (Model) => {
  const pkFromPrimaryKeys = Object.keys(Model?.primaryKeys || {})[0];
  if (pkFromPrimaryKeys) return pkFromPrimaryKeys;

  const pkFromAttributes = Object.keys(Model?.rawAttributes || {}).find(
    (attr) => Model.rawAttributes[attr]?.primaryKey,
  );
  return pkFromAttributes || "id";
};

const resolveModelByTable = (tableName) => {
  const target = String(tableName || "").toLowerCase();
  return Object.values(allModels).find(
    (m) => m?.tableName && String(m.tableName).toLowerCase() === target,
  );
};

const getEnterpriseFilter = (user, Model) => {
  if (
    hasAttribute(Model, "enterprise_fid") &&
    user?.enterprise_id !== undefined
  ) {
    return { enterprise_fid: user.enterprise_id };
  }
  return {};
};

const addAuditColumnsIfPresent = (
  payload,
  Model,
  user,
  now,
  isCreate = false,
) => {
  const nextPayload = { ...payload };

  if (
    hasAttribute(Model, "enterprise_fid") &&
    user?.enterprise_id !== undefined &&
    (nextPayload.enterprise_fid === undefined ||
      nextPayload.enterprise_fid === null ||
      nextPayload.enterprise_fid === "")
  ) {
    nextPayload.enterprise_fid = user.enterprise_id;
  }

  if (
    isCreate &&
    hasAttribute(Model, "created_by") &&
    user?.user_id !== undefined
  ) {
    nextPayload.created_by = user.user_id;
  }
  if (hasAttribute(Model, "updated_by") && user?.user_id !== undefined) {
    nextPayload.updated_by = user.user_id;
  }

  if (isCreate && hasAttribute(Model, "created_timestamp")) {
    nextPayload.created_timestamp = now;
  }
  if (hasAttribute(Model, "updated_timestamp")) {
    nextPayload.updated_timestamp = now;
  }

  return nextPayload;
};

const inferSourceKey = (RelationModel, parentModelName, parentPrimaryKey) => {
  if (!RelationModel) return null;

  const candidates = [];
  if (parentModelName) {
    candidates.push(`${String(parentModelName).toLowerCase()}_fid`);
  }

  if (parentPrimaryKey?.endsWith("_id")) {
    candidates.push(parentPrimaryKey.replace(/_id$/, "_fid"));
  }

  for (const candidate of candidates) {
    if (hasAttribute(RelationModel, candidate)) return candidate;
  }

  return null;
};

const splitDataByTargetTable = async (modelName, data) => {
  const Model = allModels[modelName];
  const mainTableName = String(Model.tableName || "").toLowerCase();

  const fieldConfigs = await FieldConfiguration.findAll({
    where: { model_name: String(modelName).toLowerCase() },
    raw: true,
  });

  const configByFieldName = new Map();
  const relationMeta = {};
  for (const field of fieldConfigs) {
    configByFieldName.set(field.field_name, field);

    if (
      field.target_table &&
      String(field.target_table).toLowerCase() !== mainTableName
    ) {
      const table = String(field.target_table).toLowerCase();
      if (!relationMeta[table]) {
        relationMeta[table] = { sourceKey: null };
      }
      if (!relationMeta[table].sourceKey && field.source_key) {
        relationMeta[table].sourceKey = field.source_key;
      }
    }
  }

  const mainData = {};
  const relationData = {};

  for (const [key, value] of Object.entries(data || {})) {
    const field = configByFieldName.get(key);
    const targetTable = field?.target_table
      ? String(field.target_table).toLowerCase()
      : null;

    if (targetTable && targetTable !== mainTableName) {
      relationData[targetTable] = relationData[targetTable] || {};
      relationData[targetTable][key] = value;
    } else {
      mainData[key] = value;
    }
  }

  return { mainData, relationData, relationMeta };
};

const hashPasswordFields = async (Model, data) => {
  const hashedData = { ...data };
  for (const attr of Object.keys(Model.rawAttributes || {})) {
    if (attr.toLowerCase().includes("password") && data[attr]) {
      const salt = await bcrypt.genSalt(10);
      hashedData[attr] = await bcrypt.hash(data[attr], salt);
    }
  }
  return hashedData;
};

const convertFilesToPaths = (data) => {
  const normalized = { ...data };

  for (const [key, value] of Object.entries(normalized)) {
    if (
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      value.path
    ) {
      normalized[key] = value.path;
      continue;
    }

    if (Array.isArray(value)) {
      const pathValues = value
        .map((item) => {
          if (item && typeof item === "object" && item.path) return item.path;
          return item;
        })
        .filter((item) => item !== undefined && item !== null);

      if (pathValues.length === 1) normalized[key] = pathValues[0];
      else normalized[key] = pathValues;
    }
  }

  return normalized;
};

export const createDynamicRecordService = async (req, { model_name, data }) => {
  const user = req.user;
  const ip = req.ip;
  const now = new Date();

  try {
    const Model = allModels[model_name];
    if (!Model) throw new Error(`Invalid model: ${model_name}`);

    data = convertFilesToPaths(data);

    const { mainData, relationData, relationMeta } =
      await splitDataByTargetTable(model_name, data);

    let createPayload = addAuditColumnsIfPresent(
      mainData,
      Model,
      user,
      now,
      true,
    );
    createPayload = await hashPasswordFields(Model, createPayload);

    const createdRecord = await Model.create(createPayload);
    const parentPrimaryKey = getPrimaryKeyField(Model);
    const parentId = createdRecord.get
      ? createdRecord.get(parentPrimaryKey)
      : createdRecord[parentPrimaryKey];

    for (const [table, payload] of Object.entries(relationData)) {
      const RelationModel = resolveModelByTable(table);
      if (!RelationModel) {
        logger.warn(`[SERVICE] Relation model missing for table='${table}'`);
        continue;
      }

      const configuredSourceKey = relationMeta[table]?.sourceKey;
      const sourceKey =
        configuredSourceKey ||
        inferSourceKey(RelationModel, model_name, parentPrimaryKey);

      let relationPayload = { ...payload };
      if (sourceKey) {
        relationPayload[sourceKey] = parentId;
      }

      relationPayload = addAuditColumnsIfPresent(
        relationPayload,
        RelationModel,
        user,
        now,
        true,
      );

      await RelationModel.create(relationPayload);
      logger.debug(`[SERVICE] Created relation record in table='${table}'`);
    }

    await createAuditLog({
      user_fid: user.user_id,
      enterprise_fid: user.enterprise_id,
      action: "CREATE",
      description: PAGE_CRUD_AUDIT_MESSAGES.CREATE_SUCCESS.replace(
        "{username}",
        user.user_name,
      ).replace("{model}", model_name),
      ip,
      status: "success",
      created_by: user.user_id,
    });

    logger.info(
      `[SERVICE] Created record for model=${model_name}, userId=${user.user_id}`,
    );
    return createdRecord;
  } catch (error) {
    logger.error(
      `[SERVICE] Error in createDynamicRecordService: ${error.message}`,
    );
    throw error;
  }
};

export const updateDynamicRecordService = async (
  req,
  { model_name, primaryKey, id, data },
) => {
  const user = req.user;
  const now = new Date();

  try {
    const Model = allModels[model_name];
    if (!Model) throw new Error(`Model not found: ${model_name}`);

    data = convertFilesToPaths(data);

    const { mainData, relationData, relationMeta } =
      await splitDataByTargetTable(model_name, data);

    let updatePayload = addAuditColumnsIfPresent(
      mainData,
      Model,
      user,
      now,
      false,
    );
    updatePayload = await hashPasswordFields(Model, updatePayload);

    await Model.update(updatePayload, {
      where: { [primaryKey]: id, ...getEnterpriseFilter(user, Model) },
    });

    for (const [table, payload] of Object.entries(relationData)) {
      const RelationModel = resolveModelByTable(table);
      if (!RelationModel) {
        logger.warn(`[SERVICE] Relation model missing for table='${table}'`);
        continue;
      }

      const configuredSourceKey = relationMeta[table]?.sourceKey;
      const sourceKey =
        configuredSourceKey ||
        inferSourceKey(RelationModel, model_name, primaryKey);

      if (!sourceKey) {
        logger.warn(
          `[SERVICE] Missing source key for relation table='${table}' and model='${model_name}'`,
        );
        continue;
      }

      let relationUpdatePayload = addAuditColumnsIfPresent(
        payload,
        RelationModel,
        user,
        now,
        false,
      );

      relationUpdatePayload = await hashPasswordFields(
        RelationModel,
        relationUpdatePayload,
      );

      const relationWhere = {
        [sourceKey]: id,
        ...getEnterpriseFilter(user, RelationModel),
      };

      const [updatedCount] = await RelationModel.update(relationUpdatePayload, {
        where: relationWhere,
      });

      if (updatedCount === 0) {
        const createPayload = addAuditColumnsIfPresent(
          { ...payload, [sourceKey]: id },
          RelationModel,
          user,
          now,
          true,
        );
        await RelationModel.create(createPayload);
      }
    }

    logger.info(
      `[SERVICE] updateDynamicRecordService completed for model=${model_name}, id=${id}`,
    );
    return true;
  } catch (error) {
    logger.error(
      `[SERVICE] Error in updateDynamicRecordService for model=${model_name}, id=${id}, error=${error.message}`,
    );
    throw error;
  }
};

export const deleteDynamicRecordService = async (
  req,
  { model_name, primaryKey, id },
) => {
  const user = req.user;

  try {
    const Model = allModels[model_name];
    if (!Model) throw new Error(`Model not found: ${model_name}`);

    const mainTableName = String(Model.tableName || "").toLowerCase();
    const fieldConfigs = await FieldConfiguration.findAll({
      where: { model_name: String(model_name).toLowerCase() },
      raw: true,
    });

    const relationTableToSourceKey = {};
    for (const field of fieldConfigs) {
      if (!field.target_table) continue;
      const table = String(field.target_table).toLowerCase();
      if (table === mainTableName) continue;
      if (!relationTableToSourceKey[table] && field.source_key) {
        relationTableToSourceKey[table] = field.source_key;
      }
    }

    for (const [table, configuredSourceKey] of Object.entries(
      relationTableToSourceKey,
    )) {
      const RelationModel = resolveModelByTable(table);
      if (!RelationModel) continue;

      const sourceKey =
        configuredSourceKey ||
        inferSourceKey(RelationModel, model_name, primaryKey);
      if (!sourceKey) continue;

      await RelationModel.destroy({
        where: {
          [sourceKey]: id,
          ...getEnterpriseFilter(user, RelationModel),
        },
      });
    }

    await Model.destroy({
      where: { [primaryKey]: id, ...getEnterpriseFilter(user, Model) },
    });

    logger.info(`[SERVICE] Deleted record for model=${model_name}, id=${id}`);
    return true;
  } catch (error) {
    logger.error(
      `[SERVICE] Error in deleteDynamicRecordService: ${error.message}`,
    );
    throw error;
  }
};

export const changeStatusService = async (
  req,
  { model_name, primaryKey, id, status },
) => {
  const user = req.user;
  const now = new Date();

  try {
    const Model = allModels[model_name];
    if (!Model) throw new Error(`Model not found: ${model_name}`);

    const modelStatusField = `${String(model_name).toLowerCase()}_status`;
    const statusField = hasAttribute(Model, modelStatusField)
      ? modelStatusField
      : hasAttribute(Model, "status")
        ? "status"
        : null;

    if (!statusField) {
      throw new Error(`No status field found for model: ${model_name}`);
    }

    const statusPayload = addAuditColumnsIfPresent(
      { [statusField]: status },
      Model,
      user,
      now,
      false,
    );

    await Model.update(statusPayload, {
      where: { [primaryKey]: id, ...getEnterpriseFilter(user, Model) },
    });

    logger.info(
      `[SERVICE] Changed status for model=${model_name}, id=${id} to ${status}`,
    );
    return true;
  } catch (error) {
    logger.error(`[SERVICE] Error in changeStatusService: ${error.message}`);
    throw error;
  }
};
