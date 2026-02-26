// models/userSession.model.js
import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "UserSession",
    {
      session_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      user_fid: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      login_history_fid: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      access_token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      device_info: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ip_address: {
        type: DataTypes.STRING(45),
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      access_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      refresh_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      session_end_timestamp: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_by: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    },
    {
      tableName: "user_sessions",
      timestamps: true,
      createdAt: "created_timestamp",
      updatedAt: "updated_timestamp",
      underscored: true,
      id: false,
    }
  );
