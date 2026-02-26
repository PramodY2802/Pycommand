import { Page, RolePagePermission, Role } from "../models/index.js";
import { Op } from "sequelize";

/**
 * =====================================================
 * AUTO RBAC MIDDLEWARE
 * Detects action automatically from route
 * =====================================================
 */

export const autoAuthorize = async (req, res, next) => {

  try {

    const user = req.user;

    /**
     * SUPER ADMIN BYPASS
     */

    if (user.is_super_admin) return next();


    /**
     * STEP 1: Detect action
     */

    let action = null;

    const method = req.method;
    const path = req.route.path.toLowerCase();


    if (method === "post" && path.includes("create"))
      action = "create";

    else if (method === "put" && path.includes("update"))
      action = "edit";

    else if (method === "delete")
      action = "delete";

    else if (method === "get")
      action = "view";

    else if (path.includes("change-status"))
      action = "edit";


    if (!action)
      return res.status(403).json({

        success: false,
        message: "Cannot detect action",

      });


    /**
     * STEP 2: Get model_name
     */

    const model_name =
      req.body.model_name ||
      req.query.model_name ||
      req.params.model_name;


    if (!model_name)
      return res.status(400).json({

        success: false,
        message: "model_name required",

      });


    /**
     * STEP 3: Get page
     */

    const page = await Page.findOne({

      where: {

        model_name,

        enterprise_fid: user.enterprise_id,

        is_active: true,

        page_status: "active",

      },

    });


    if (!page)
      return res.status(403).json({

        success: false,
        message: "Page not found",

      });


    /**
     * STEP 4: Get enterprise roles
     */

    const roles = await Role.findAll({

      where: {

        role_id: {

          [Op.in]: user.role_ids,

        },

        enterprise_fid: user.enterprise_id,

        role_status: "active",

      },

      attributes: ["role_id"],

    });


    const roleIds = roles.map(r => r.role_id);


    /**
     * STEP 5: Get permission
     */

    const permission = await RolePagePermission.findOne({

      where: {

        role_fid: {

          [Op.in]: roleIds,

        },

        page_fid: page.page_id,

        role_page_permission_status: "active",

      },

    });


    if (!permission)
      return res.status(403).json({

        success: false,
        message: "No page permission",

      });


    /**
     * STEP 6: Check action permission
     */

    let allowed = false;

    switch (action) {

      case "view":

        allowed = permission.can_view;
        break;

      case "create":

        allowed = permission.can_create;
        break;

      case "edit":

        allowed = permission.can_edit;
        break;

      case "delete":

        allowed = permission.can_delete;
        break;

    }


    if (!allowed)
      return res.status(403).json({

        success: false,
        message: `${action} not allowed`,

      });


    /**
     * STEP 7: attach
     */

    req.page = page;
    req.action = action;


    next();


  }
  catch (error) {

    console.error(error);

    return res.status(500).json({

      success: false,
      message: "RBAC failed",

    });

  }

};
