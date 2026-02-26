import * as allModels from "../models/index.js";
import { modelFieldMapping } from "../utils/modelFieldMapping.js";
import { Page, FieldConfiguration } from "../models/index.js";

import { logger } from "../config/logger.js";
import { createAuditLog } from "./auditLog.service.js";
import { PAGE_AUDIT_LOG_MESSAGES } from "../constant/auditLog.constants.js";
import { PAGE_LOG_MESSAGES } from "../constant/logMessages.js";

import util from "util";

/**
 * =====================================================
 * ENTERPRISE FILTER
 * =====================================================
 */
const getEnterpriseFilter = (user, Model) => {
  if (Model.rawAttributes.enterprise_fid && !user.is_super_admin) {
    return { enterprise_fid: user.enterprise_id };
  }
  return {};
};

/**
 * =====================================================
 * GET PAGE DATA SERVICE (FULL DYNAMIC RELATION SUPPORT)
 * =====================================================
 */
export const getPageDataService = async (req, res) => {
  const user = req.user || {};
  const requestId = req.requestId || "N/A";

  try {
    const { page_code } = req.query;
    if (!page_code)
      return res.status(400).json({ error: "Page code required" });

    /**
     * =====================================================
     * PAGE META
     * =====================================================
     */
    const pageRow = await Page.findOne({
      where: {
        model_name: page_code,
        is_active: true,
      },
      raw: true,
    });

    if (!pageRow) return res.status(404).json({ error: "Page not found" });

    /**
     * =====================================================
     * STATIC CONFIG
     * =====================================================
     */
    const config = modelFieldMapping[pageRow.model_name.toUpperCase()];
    if (!config) return res.status(404).json({ error: "Page config missing" });

    /**
     * =====================================================
     * TARGET MODEL
     * =====================================================
     */

    logger.debug(`All model names: ${Object.keys(allModels).join(", ")}`);
    logger.debug(` model name from frontend: ${pageRow.model_name}`);

    const TargetModel = allModels[pageRow.model_name];
    if (!TargetModel) return res.status(404).json({ error: "Model missing" });

    const primaryKey = Object.keys(TargetModel.primaryKeys)[0] || "id";

    /**
     * =====================================================
     * FETCH MAIN DATA
     * =====================================================
     */
    const whereCondition = getEnterpriseFilter(user, TargetModel);

    let data = await TargetModel.findAll({
      where: whereCondition,
      raw: true,
    });

    /**
     * =====================================================
     * FETCH FIELD CONFIG
     * =====================================================
     */
    const fieldConfigs = await FieldConfiguration.findAll({
      where: { model_name: pageRow.model_name.toLowerCase() },
      raw: true,
    });

    /**
     * =====================================================
     * PROCESS RELATIONS DYNAMICALLY
     * =====================================================
     */
    const mainTableName = String(TargetModel.tableName || "").toLowerCase();

    for (const field of fieldConfigs) {
      if (!field.reference_model) continue;

      const RefModel = allModels[field.reference_model];
      if (!RefModel) continue;

      const RelationModel = Object.values(allModels).find(
        (m) => m.tableName === field.target_table,
      );

      const fieldTargetTable = String(field.target_table || "").toLowerCase();
      const isRelationField =
        Boolean(field.source_key && field.target_key) &&
        Boolean(fieldTargetTable) &&
        fieldTargetTable !== mainTableName;

      for (const row of data) {
        /**
         * =====================================================
         * CASE 1: DIRECT FOREIGN KEY
         * Example:
         * user.enterprise_fid → enterprise.enterprise_id
         * =====================================================
         */
        if (
          row[field.field_name] !== undefined &&
          row[field.field_name] !== null &&
          row[field.field_name] !== "" &&
          !isRelationField
        ) {
          const ref = await RefModel.findOne({
            where: {
              [field.reference_key]: row[field.field_name],
            },
            raw: true,
          });

          row[field.reference_label] = ref?.[field.reference_label] || null;
        } else if (isRelationField && RelationModel) {

        /**
         * =====================================================
         * CASE 2: RELATION TABLE (DYNAMIC)
         * Example:
         * user → user_roles → roles
         * =====================================================
         */
          // ✅ SAFETY CHECK
          if (!field.source_key || !field.target_key) {
            logger.warn(
              `Relation config missing source_key or target_key for field: ${field.field_name}`,
            );
            continue;
          }

          // Step 1: Find relation record dynamically
          const relation = await RelationModel.findOne({
            where: {
              [field.source_key]: row[primaryKey],
            },
            raw: true,
          });

          if (!relation) continue;

          // Step 2: Extract target id dynamically
          const targetId = relation[field.target_key];

          if (!targetId) continue;

          // attach foreign key value
          row[field.field_name] = targetId;

          // Step 3: Fetch reference label
          const ref = await RefModel.findOne({
            where: {
              [field.reference_key]: targetId,
            },
            raw: true,
          });

          row[field.reference_label] = ref?.[field.reference_label] || null;
        }
      }
    }

    /**
     * =====================================================
     * FILTER TABLE COLUMNS
     * =====================================================
     */
    data = data.map((row) => {
      const filtered = {};
      config.columns.forEach((col) => {
        filtered[col.key] = row[col.key];
      });
      fieldConfigs.forEach((field) => {
        if (row[field.field_name] !== undefined)
          filtered[field.field_name] = row[field.field_name];
        if (field.reference_label)
          filtered[field.reference_label] = row[field.reference_label];
      });
      return filtered;
    });

    /**
     * =====================================================
     * BUILD FORM CONFIG
     * =====================================================
     */
    let formConfig = [...config.form];
    for (const field of fieldConfigs) {
      if (field.input_type === "select") {
        const RefModel = allModels[field.reference_model];
        if (!RefModel) continue;
        const options = await RefModel.findAll({ raw: true });
        formConfig.push({
          name: field.field_name,
          label: field.field_label,
          type: "select",
          required: field.is_required,
          options: options.map((o) => ({
            label: o[field.reference_label],
            value: o[field.reference_key],
          })),
        });
      } else {
        formConfig.push({
          name: field.field_name,
          label: field.field_label,
          type: field.input_type,
          required: field.is_required,
        });
      }
    }

    /**
     * =====================================================
     * BUILD STATS (3 CARDS, PAGE ICON, NO SUMMARY)
     * =====================================================
     */
    let stats_data = [];
    const statusField = TargetModel.rawAttributes[
      `${pageRow.model_name.toLowerCase()}_status`
    ]
      ? `${pageRow.model_name.toLowerCase()}_status`
      : TargetModel.rawAttributes["status"]
        ? "status"
        : null;

    if (statusField) {
      const total = data.length;
      const active = data.filter(
        (d) => d[statusField] === "active" || d[statusField] === true,
      ).length;
      const inactive = total - active;
      const pageIcon = pageRow.page_icon || null;

      stats_data.push(
        { title: `${pageRow.model_name} Total`, icon: pageIcon, value: total },
        {
          title: `${pageRow.model_name} Active`,
          icon: pageIcon,
          value: active,
        },
        {
          title: `${pageRow.model_name} Inactive`,
          icon: pageIcon,
          value: inactive,
        },
      );
    }

    /**
     * =====================================================
     * RESPONSE
     * =====================================================
     */
    const response = {
      [pageRow.model_name]: {
        title: pageRow.page_name,
        code: pageRow.model_name,
        page_route: pageRow.page_route,
        model_name: pageRow.model_name,
        primaryKey,
        api: pageRow.page_api,
        stats: config.stats,
        stats_data, // ✅ Added stats cards
        columns: config.columns,
        form: formConfig,
        data,
      },
    };

    /**
     * =====================================================
     * AUDIT LOG
     * =====================================================
     */
    await createAuditLog({
      user_fid: user.user_id,
      enterprise_fid: user.enterprise_id,
      action: "PAGE_FETCH_SUCCESS",
      description: PAGE_AUDIT_LOG_MESSAGES.PAGE_FETCH_SUCCESS.replace(
        "{username}",
        user.user_name,
      ).replace("{page}", pageRow.page_name),
      ip: req.ip,
      status: "success",
      created_by: user.user_id,
    });

    logger.info(
      util.format(
        PAGE_LOG_MESSAGES.PAGE_FETCH_SUCCESS,
        user.user_id,
        pageRow.page_name,
        requestId,
      ),
    );

    res.json(response);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
};
