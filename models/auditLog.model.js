// models/auditLog.model.js
import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "AuditLog",
    {
      audit_log_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      user_fid: { type: DataTypes.INTEGER, allowNull: true },
      enterprise_fid: { type: DataTypes.INTEGER, allowNull: true },

      audit_log_action: { type: DataTypes.STRING, allowNull: true },
      audit_log_description: { type: DataTypes.TEXT, allowNull: true },
      audit_log_ip: { type: DataTypes.STRING, allowNull: true },

      // added fields per request
      entity: { type: DataTypes.TEXT, allowNull: true },
      entity_id: { type: DataTypes.INTEGER, allowNull: true },

      audit_log_status: { type: DataTypes.STRING, defaultValue: "active" },
      created_by: { type: DataTypes.INTEGER, allowNull: true },
      updated_by: { type: DataTypes.INTEGER, allowNull: true },
      created_timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "audit_logs",
      timestamps: false,
    }
  );
