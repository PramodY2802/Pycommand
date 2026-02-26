import { Role, Page, RolePagePermission, UserRole } from "../models/index.js";

import { createAuditLog } from "./auditLog.service.js";

import { logger } from "../config/logger.js";

import { AUDIT_LOG_MESSAGES } from "../constant/auditLog.constants.js";

import { RBAC_LOG_MESSAGES } from "../constant/logMessages.js";

/**
==================================================
GET USER RBAC
==================================================
*/

export const getUserRBACService = async (req) => {
  try {
    const userId = req.user.user_id;

    const isSuperAdmin = req.user.is_super_admin;

    const selectedRoleId = req.query.roleId;

    /**
      SUPER ADMIN
      */

    if (isSuperAdmin) {
      const roles = await Role.findAll({
        where: {
          role_status: "active",
        },

        attributes: ["role_id", "role_name"],

        order: [["role_name", "ASC"]],
      });

      const pages = await Page.findAll({
        where: {
          is_active: true,
        },

        include: [
          {
            model: RolePagePermission,

            where: selectedRoleId
              ? {
                  role_fid: selectedRoleId,
                }
              : undefined,

            required: false,
          },
        ],

        order: [["page_name", "ASC"]],
      });

      const formattedPages = pages.map((page) => {
        const perm = page.RolePagePermissions?.[0];

        if (!selectedRoleId) {
          return {
            page_id: page.page_id,

            page_name: page.page_name,

            page_route: page.page_route,

            model_name: page.model_name,

            page_api: page.page_api,

            can_view: true,

            can_create: true,

            can_edit: true,

            can_delete: true,
          };
        }

        return {
          page_id: page.page_id,

          page_name: page.page_name,

          page_route: page.page_route,

          model_name: page.model_name,

          page_api: page.page_api,

          can_view: perm?.can_view || false,

          can_create: perm?.can_create || false,

          can_edit: perm?.can_edit || false,

          can_delete: perm?.can_delete || false,
        };
      });

      return {
        roles,
        pages: formattedPages,
      };
    }

    /**
      NORMAL USER
      */

    const userRoles = await UserRole.findAll({
      where: {
        user_fid: userId,
      },

      attributes: ["role_fid"],
    });

    const roleIds = userRoles.map((r) => r.role_fid);

    const permissions = await RolePagePermission.findAll({
      where: {
        role_fid: roleIds,
      },

      include: [
        {
          model: Page,

          where: {
            is_active: true,
          },
        },
      ],
    });

    const pages = permissions.map((p) => ({
      page_id: p.Page.page_id,

      page_name: p.Page.page_name,

      page_route: p.Page.page_route,

      model_name: p.Page.model_name,

      page_api: p.Page.page_api,

      can_view: p.can_view,

      can_create: p.can_create,

      can_edit: p.can_edit,

      can_delete: p.can_delete,
    }));

    return {
      roles: [],
      pages,
    };
  } catch (error) {
    logger.error(RBAC_LOG_MESSAGES.RBAC_FETCH_ERROR, error);

    throw error;
  }
};

/**
==================================================
UPDATE PAGE PERMISSION
AUTO CREATE IF NOT EXIST
==================================================
*/

export const updatePagePermissionService = async (
  req,
  roleId,
  pageId,
  permissions,
) => {
  try {
    const userId = req.user.user_id;

    const enterpriseId = req.user.enterprise_id;

    const ip = req.ip;

    let permission = await RolePagePermission.findOne({
      where: {
        role_fid: roleId,

        page_fid: pageId,
      },
    });

    if (!permission) {
      permission = await RolePagePermission.create({
        role_fid: roleId,

        page_fid: pageId,

        can_view: permissions.can_view ?? false,

        can_create: permissions.can_create ?? false,

        can_edit: permissions.can_edit ?? false,

        can_delete: permissions.can_delete ?? false,

        created_by: userId,
      });
    } else {
      await permission.update({
        ...permissions,
        updated_by: userId,
      });
    }

    await createAuditLog({
      user_fid: userId,

      enterprise_fid: enterpriseId,

      action: "PAGE_PERMISSION_UPDATED",

      description: AUDIT_LOG_MESSAGES.PAGE_PERMISSION_UPDATED.replace(
        "{page}",
        pageId,
      ).replace("{role}", roleId),

      ip,

      status: "success",
    });

    return permission;
  } catch (error) {
    logger.error(RBAC_LOG_MESSAGES.PAGE_PERMISSION_UPDATE_ERROR, error);

    throw error;
  }
};
