import express from "express";

import {
  createDynamicRecordController,
  updateDynamicRecordController,
  deleteDynamicRecordController,
  changeStatusController,
} from "../../controllers/pageCrud.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import upload from "../../middlewares/uploadMiddleware.js";

import {
  validateCreateDynamicRecord,
  validateUpdateDynamicRecord,
  validateDeleteDynamicRecord,
} from "../../middlewares/validations/pageCRUD.validation.js";

import { autoAuthorize } from "../../middlewares/authorizePage.middleware.js";

const router = express.Router();

/**
 * ==========================================
 * CREATE RECORD
 * ==========================================
 */
router.post(
  "/create",
  authenticate,
  autoAuthorize, // ✅ HERE
  upload.any(), // ✅ allow multiple/dynamic file fields
  // validateCreateDynamicRecord,
  createDynamicRecordController,
);

/**
 * ==========================================
 * UPDATE RECORD
 * ==========================================
 */
router.put(
  "/update",
  authenticate,
  autoAuthorize,
  upload.any(), // ✅ dynamic file upload support
  // validateUpdateDynamicRecord,
  updateDynamicRecordController,
);

/**
 * ==========================================
 * DELETE RECORD
 * ==========================================
 */
router.delete(
  "/delete",
  authenticate,
  autoAuthorize,
  validateDeleteDynamicRecord,
  deleteDynamicRecordController,
);

/**
 * ==========================================
 * CHANGE STATUS
 * ==========================================
 */
router.put(
  "/change-status",
  authenticate,
  autoAuthorize,
  changeStatusController,
);

export default router;
