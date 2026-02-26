// models/user_files.model.js
import { DataTypes } from "sequelize";

export default (sequelize) =>
  sequelize.define(
    "UserFile",
    {
      user_files_id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      // Foreign keys
      user_fid: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      enterprise_fid: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      // ✅ New field → For Folder Structure
      parent_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null,
        comment: "Parent folder/file ID. Null = root level",
      },

      // ✅ Type → file / folder
      item_type: {
        type: DataTypes.ENUM("file", "folder"),
        allowNull: false,
        defaultValue: "file",
      },

      // ✅ Folder/File Name
      user_files_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      // ✅ File Path (null for folders)
      user_files_path: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      // ✅ File Extension (null for folders)
      file_extension: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },

      // ✅ File Size (in bytes, null for folders)
      file_size: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },

      // ✅ File Hash (optional)
      file_hash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Optional hash of the file for integrity check",
      },

      // ✅ Type of file (image/doc/media/folder)
      file_type: {
        type: DataTypes.ENUM("image", "doc", "media", "folder"),
        allowNull: false,
        defaultValue: "doc",
      },

      // ✅ Category → profile/document/shared/etc.
      file_category: {
        type: DataTypes.ENUM("profile", "document", "shared", "folder"),
        allowNull: false,
        defaultValue: "document",
      },

      // ✅ Move tracking
      old_path: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },

      // ✅ Status
      user_files_status: {
        type: DataTypes.ENUM("0", "1"), // 0 = inactive, 1 = active
        defaultValue: "1",
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
      tableName: "user_files",
      timestamps: true,
      createdAt: "created_timestamp",
      updatedAt: "updated_timestamp",
      underscored: true,
    }
  );
