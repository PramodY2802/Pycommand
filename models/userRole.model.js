// models/userRole.model.js
import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "UserRole",
    {
      user_role_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

      user_fid: { type: DataTypes.INTEGER, allowNull: false },
      role_fid: { type: DataTypes.INTEGER, allowNull: false },

      user_role_status: { type: DataTypes.STRING, defaultValue: "active" },
      created_by: { type: DataTypes.INTEGER, allowNull: true },
      updated_by: { type: DataTypes.INTEGER, allowNull: true },
      created_timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "user_roles",
      timestamps: false,
    }
  );
