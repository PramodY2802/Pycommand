// models/category.model.js
import { DataTypes } from "sequelize";

export default (sequelize) => {
  return sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "'income' or 'expense'",
      },

      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
    },
    {
      tableName: "categories",
      timestamps: false,
    },
  );
};
