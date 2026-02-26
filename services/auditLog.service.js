// services/auditLog.service.js
import {AuditLog} from "../models/index.js"; // assuming you have index.js exporting all models

export const createAuditLog = async ({
  user_fid,
  enterprise_fid,
  action,
  description,
  ip,
  status = "active",
  created_by,
}) => {
  return AuditLog.create({
    user_fid,
    enterprise_fid,
    audit_log_action: action,
    audit_log_description: description,
    audit_log_ip: ip,
    audit_log_status: status,
    created_by,
    updated_by: created_by,
  });
};
