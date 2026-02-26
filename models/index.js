import { sequelize } from "../config/database.js";

import EnterpriseModel from "./enterprise.model.js";
import UserModel from "./user.model.js";
import RoleModel from "./role.model.js";
import PermissionModel from "./permission.model.js";
import UserRoleModel from "./userRole.model.js";
import RolePermissionModel from "./rolePermission.model.js";

import PageModel from "./page.model.js";
import RolePagePermissionModel from "./rolePagePermission.model.js";

import AuditLogModel from "./auditLog.model.js";
import UserSessionModel from "./userSession.model.js";
import LoginHistoryModel from "./loginHistory.model.js";

import OTPVerificationModel from "./otpVerification.model.js";

import FieldConfigurationModel from "./fieldConfiguration.model.js";

import UserFileModel from "./user_files.model.js"; // ✅ NEW MODEL

import PasswordResetTokenModel from "./passwordResetToken.model.js";
import CategoryModel from "./category.model.js";
import IncomeModel from "./income.model.js";
import ExpenseModel from "./expense.model.js";

// ================= INITIALIZE =================

const Enterprise = EnterpriseModel(sequelize);

const User = UserModel(sequelize);

const Role = RoleModel(sequelize);

const Permission = PermissionModel(sequelize);

const UserRole = UserRoleModel(sequelize);

const RolePermission = RolePermissionModel(sequelize);

const Page = PageModel(sequelize);

const RolePagePermission = RolePagePermissionModel(sequelize);

const AuditLog = AuditLogModel(sequelize);

const UserSession = UserSessionModel(sequelize);

const LoginHistory = LoginHistoryModel(sequelize);

const OTPVerification = OTPVerificationModel(sequelize);

const FieldConfiguration = FieldConfigurationModel(sequelize);

const UserFile = UserFileModel(sequelize); // ✅ INITIALIZED

const PasswordResetToken = PasswordResetTokenModel(sequelize);

const Category = CategoryModel(sequelize);

const Income = IncomeModel(sequelize);

const Expense = ExpenseModel(sequelize);

// =====================================================
// ENTERPRISE RELATIONS
// =====================================================

Enterprise.hasMany(User, {
  foreignKey: "enterprise_fid",
});

User.belongsTo(Enterprise, {
  foreignKey: "enterprise_fid",
});

Enterprise.hasMany(Role, {
  foreignKey: "enterprise_fid",
});

Role.belongsTo(Enterprise, {
  foreignKey: "enterprise_fid",
});

Enterprise.hasMany(Page, {
  foreignKey: "enterprise_fid",
});

Page.belongsTo(Enterprise, {
  foreignKey: "enterprise_fid",
});

// ✅ NEW

Enterprise.hasMany(UserFile, {
  foreignKey: "enterprise_fid",
});

UserFile.belongsTo(Enterprise, {
  foreignKey: "enterprise_fid",
});

// =====================================================
// USER ROLE RELATIONS
// =====================================================

User.belongsToMany(Role, {
  through: UserRole,

  foreignKey: "user_fid",
});

Role.belongsToMany(User, {
  through: UserRole,

  foreignKey: "role_fid",
});

// =====================================================
// PERMISSION RELATIONS
// =====================================================

Role.belongsToMany(Permission, {
  through: RolePermission,

  foreignKey: "role_fid",
});

Permission.belongsToMany(Role, {
  through: RolePermission,

  foreignKey: "permission_fid",
});

// =====================================================
// PAGE PERMISSION
// =====================================================

Role.belongsToMany(Page, {
  through: RolePagePermission,

  foreignKey: "role_fid",
});

Page.belongsToMany(Role, {
  through: RolePagePermission,

  foreignKey: "page_fid",
});

RolePagePermission.belongsTo(Role, {
  foreignKey: "role_fid",
});

RolePagePermission.belongsTo(Page, {
  foreignKey: "page_fid",
});

Role.hasMany(RolePagePermission, {
  foreignKey: "role_fid",
});

Page.hasMany(RolePagePermission, {
  foreignKey: "page_fid",
});

// =====================================================
// AUDIT LOG
// =====================================================

User.hasMany(AuditLog, {
  foreignKey: "user_fid",
});

AuditLog.belongsTo(User, {
  foreignKey: "user_fid",
});

Enterprise.hasMany(AuditLog, {
  foreignKey: "enterprise_fid",
});

AuditLog.belongsTo(Enterprise, {
  foreignKey: "enterprise_fid",
});

// =====================================================
// USER SESSION
// =====================================================

UserSession.belongsTo(LoginHistory, {
  foreignKey: "login_history_fid",

  as: "loginHistory",
});

LoginHistory.hasMany(UserSession, {
  foreignKey: "login_history_fid",

  as: "sessions",
});

User.hasMany(UserSession, {
  foreignKey: "user_fid",

  as: "sessions",
});

UserSession.belongsTo(User, {
  foreignKey: "user_fid",

  as: "user",
});

// =====================================================
// OTP
// =====================================================

User.hasMany(OTPVerification, {
  foreignKey: "user_fid",

  as: "otps",
});

OTPVerification.belongsTo(User, {
  foreignKey: "user_fid",

  as: "user",
});

// =====================================================
// USER FILE RELATIONS (VERY IMPORTANT)
// =====================================================

// User → Files

User.hasMany(UserFile, {
  foreignKey: "user_fid",
});

UserFile.belongsTo(User, {
  foreignKey: "user_fid",
});


// =====================================================
// PASSWORD RESET TOKEN RELATIONS
// =====================================================

User.hasMany(PasswordResetToken, {
  foreignKey: "user_id",
});

PasswordResetToken.belongsTo(User, {
  foreignKey: "user_id",
});

// =====================================================
// INCOME & EXPENSE RELATIONS
// =====================================================

User.hasMany(Income, {
  foreignKey: "user_id",
});

Income.belongsTo(User, {
  foreignKey: "user_id",
});

Category.hasMany(Income, {
  foreignKey: "category_id",
});

Income.belongsTo(Category, {
  foreignKey: "category_id",
});

User.hasMany(Expense, {
  foreignKey: "user_id",
});

Expense.belongsTo(User, {
  foreignKey: "user_id",
});

Category.hasMany(Expense, {
  foreignKey: "category_id",
});

Expense.belongsTo(Category, {
  foreignKey: "category_id",
});

export {
  sequelize,
  Enterprise,
  User,
  Role,
  Permission,
  UserRole,
  RolePermission,
  Page,
  RolePagePermission,
  AuditLog,
  UserSession,
  LoginHistory,
  OTPVerification,
  FieldConfiguration,
  UserFile,
  PasswordResetToken,
  Category,
  Income,
  Expense,
};
