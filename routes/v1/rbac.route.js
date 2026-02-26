import express from "express";

import {
  getUserRBACController,
  updatePagePermissionController,
} from "../../controllers/rbac.controller.js";

import {
  validateUpdatePagePermission,
} from "../../middlewares/validations/rbac.validation.js";

import { authenticate } from "../../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * ==========================================
 * GET USER RBAC
 * ==========================================
 */

router.get(
  "/my-rbac",
  authenticate,
  getUserRBACController,
);

/**
 * ==========================================
 * UPDATE PAGE PERMISSION
 * ==========================================
 */

router.put(
  "/update-permission",
  authenticate,
  validateUpdatePagePermission,
  updatePagePermissionController,
);

export default router;
