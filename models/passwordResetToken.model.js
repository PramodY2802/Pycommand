// models/passwordResetToken.model.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "PasswordResetToken",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },

      token: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      tableName: "password_reset_tokens",
      timestamps: false,
    },
  );
};
