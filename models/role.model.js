// models/role.model.js
import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Role",
    {
      role_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      enterprise_fid: { type: DataTypes.INTEGER, allowNull: false },

      role_name: { type: DataTypes.STRING, allowNull: false },

      role_status: { type: DataTypes.STRING, defaultValue: "active" },
      created_by: { type: DataTypes.INTEGER, allowNull: true },
      updated_by: { type: DataTypes.INTEGER, allowNull: true },
      created_timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "roles",
      timestamps: false,
    }
  );
