// models/rolePagePermission.model.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "RolePagePermission",
    {
      role_page_permission_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      role_fid: { type: DataTypes.INTEGER, allowNull: false },
      page_fid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      can_view: { type: DataTypes.BOOLEAN, defaultValue: true },
      can_create: { type: DataTypes.BOOLEAN, defaultValue: false },
      can_edit: { type: DataTypes.BOOLEAN, defaultValue: false },
      can_delete: { type: DataTypes.BOOLEAN, defaultValue: false },

      role_page_permission_status: {
        type: DataTypes.STRING,
        defaultValue: "active",
      },

      created_by: { type: DataTypes.INTEGER, allowNull: true },
      updated_by: { type: DataTypes.INTEGER, allowNull: true },

      created_timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "role_page_permissions",
      timestamps: false,
    },
  );
};
