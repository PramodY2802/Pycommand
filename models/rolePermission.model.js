// models/rolePermission.model.js
import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "RolePermission",
    {
      role_permission_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      role_fid: { type: DataTypes.INTEGER, allowNull: false },
      permission_fid: { type: DataTypes.INTEGER, allowNull: false },

      role_permission_status: { type: DataTypes.STRING, defaultValue: "active" },
      created_by: { type: DataTypes.INTEGER, allowNull: true },
      updated_by: { type: DataTypes.INTEGER, allowNull: true },
      created_timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "role_permissions",
      timestamps: false,
    }
  );
