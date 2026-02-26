// models/user.model.js
import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      enterprise_fid: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      user_profile_pic: DataTypes.STRING,
      user_fullname: { type: DataTypes.STRING, allowNull: false },
      user_name: { type: DataTypes.STRING, allowNull: false, unique: true },
      user_email: { type: DataTypes.STRING, allowNull: false, unique: true },
      user_password: { type: DataTypes.STRING, allowNull: false },

      /* ✅ ADD THIS FIELD */
      is_super_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },

      /* Mandatory Fields */
      user_status: {
        type: DataTypes.STRING,
        defaultValue: "active",
      },
      created_by: { type: DataTypes.INTEGER, allowNull: true },
      updated_by: { type: DataTypes.INTEGER, allowNull: true },
      created_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );
