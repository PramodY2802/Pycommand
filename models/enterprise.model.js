// models/enterprise.model.js
import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "Enterprise",
    {
      enterprise_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      enterprise_name: { type: DataTypes.STRING, allowNull: false },
      enterprise_address_1: DataTypes.STRING,
      enterprise_address_2: DataTypes.STRING,
      enterprise_city: DataTypes.STRING,
      enterprise_state: DataTypes.STRING,
      enterprise_zip_code: DataTypes.STRING,
      enterprise_country: DataTypes.STRING,
      enterprise_logo: DataTypes.STRING,
      enterprise_theme: DataTypes.STRING,

      enterprise_phone_1: DataTypes.STRING,
      enterprise_phone_2: DataTypes.STRING,
      enterprise_mobile_1: DataTypes.STRING,
      enterprise_mobile_2: DataTypes.STRING,

      enterprise_email_1: DataTypes.STRING,
      enterprise_email_2: DataTypes.STRING,

      contact_person_name: DataTypes.STRING,
      contact_person_phone: DataTypes.STRING,
      contact_person_email: DataTypes.STRING,
      contact_person_mobile: DataTypes.STRING,
      contact_person_designation: DataTypes.STRING,

      alt_contact_person_name: DataTypes.STRING,
      alt_contact_person_phone: DataTypes.STRING,
      alt_contact_person_email: DataTypes.STRING,
      alt_contact_person_mobile: DataTypes.STRING,
      alt_contact_person_designation: DataTypes.STRING,

      /* Mandatory Fields */
      enterprise_status: { type: DataTypes.STRING, defaultValue: "active" },
      created_by: DataTypes.INTEGER,
      updated_by: DataTypes.INTEGER,
      created_timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "enterprises",
      timestamps: false,
    }
  );
