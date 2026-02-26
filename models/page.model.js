// models/page.model.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Page",
    {
      page_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      enterprise_fid: { type: DataTypes.INTEGER, allowNull: true },

      page_name: { type: DataTypes.STRING, allowNull: false, unique: true },
      page_route: { type: DataTypes.STRING, allowNull: false, unique: true },

      // ⭐ Replace page_code with model_name
      model_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      // ⭐ Add page_api
      page_api: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      page_icon: { type: DataTypes.STRING, allowNull: true },

      is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
      page_status: { type: DataTypes.STRING, defaultValue: "active" },

      // ✅ Change to INTEGER
      created_by: { type: DataTypes.INTEGER, allowNull: true },
      updated_by: { type: DataTypes.INTEGER, allowNull: true },

      created_timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "pages",
      timestamps: false,
    },
  );
};
