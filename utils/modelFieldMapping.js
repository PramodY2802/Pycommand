export const modelFieldMapping = {
  // ===================== PAGE =====================
  PAGE: {
    stats: true,
    columns: [
      { key: "page_id", label: "ID", sortable: true },
      { key: "page_name", label: "Page Name", sortable: true },
      { key: "page_route", label: "Route", sortable: true },
      { key: "model_name", label: "Model", sortable: true },
      { key: "page_api", label: "API" },
      { key: "page_icon", label: "Icon" },
      { key: "page_status", label: "Status" },
      { key: "updated_timestamp", label: "Updated At",type: "datetime", sortable: true },
    ],
    form: [
      { name: "page_name", label: "Page Name", type: "text", required: true },
      { name: "page_route", label: "Page Route", type: "text", required: true },
      { name: "model_name", label: "Model Name", type: "text", required: true },
      { name: "page_api", label: "Page API", type: "text" },
      { name: "page_icon", label: "Page Icon", type: "text" },
      // {
      //   name: "page_status",
      //   label: "Status",
      //   type: "select",
      //   options: [
      //     { label: "Active", value: "active" },
      //     { label: "Inactive", value: "inactive" },
      //   ],
      // },
    ],
  },

  // ===================== USER =====================

  USER: {
    stats: true,

    // =====================
    // TABLE COLUMNS
    // =====================
    columns: [
      { key: "user_id", label: "ID" },

      { key: "user_profile_pic", label: "Profile Pic" },

      { key: "user_fullname", label: "Full Name" },

      { key: "user_name", label: "User Name" },

      { key: "user_email", label: "Email" },

      { key: "user_status", label: "Status" },

      { key: "is_super_admin", label: "Super Admin" },

      { key: "enterprise_name", label: "Enterprise" },

      { key: "role_name", label: "Role" },

      // { key: "created_by", label: "Created By" },

      // { key: "updated_by", label: "Updated By" },

      // { key: "created_timestamp", label: "Created" },

      { key: "updated_timestamp", label: "Updated", type: "datetime",},
    ],

    // =====================
    // FORM FIELDS
    // =====================
    form: [
      // {
      //   name: "user_profile_pic",
      //   label: "Profile Picture",
      //   type: "file",
      // },

      {
        name: "user_fullname",
        label: "Full Name",
        type: "text",
        required: true,
      },

      {
        name: "user_name",
        label: "User Name",
        type: "text",
        required: true,
      },

      {
        name: "user_email",
        label: "Email",
        type: "email",
        required: true,
      },

      {
        name: "user_password",
        label: "Password",
        type: "password",
        required: true,
      },

      {
        name: "is_super_admin",
        label: "Super Admin",
        type: "select",
        required: true,
        options: [
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
    ],

    // =====================
    // SEARCH SUPPORT
    // =====================

    search: ["user_fullname", "user_name", "user_email"],

    // =====================
    // SORT SUPPORT
    // =====================

    sortable: [
      "user_id",
      "user_fullname",
      "user_name",
      "user_email",
      "created_timestamp",
    ],

    // =====================
    // PRIMARY KEY
    // =====================

    primaryKey: "user_id",

    // =====================
    // TITLE FIELD
    // =====================

    titleField: "user_fullname",
  },

  // ===================== ROLE =====================
  ROLE: {
    stats: true,
    columns: [
      { key: "role_id", label: "ID", sortable: true },
      { key: "enterprise_name", label: "Enterprise" },
      { key: "role_name", label: "Role Name", sortable: true },
      { key: "role_status", label: "Status" },
      { key: "updated_timestamp", label: "Updated At",type: "datetime", sortable: true },
    ],
    form: [
      { name: "role_name", label: "Role Name", type: "text", required: true },
      // {
      //   name: "role_status",
      //   label: "Status",
      //   type: "select",
      //   options: [
      //     { label: "Active", value: "active" },
      //     { label: "Inactive", value: "inactive" },
      //   ],
      // },
    ],
  },

  // ===================== ENTERPRISE =====================
  ENTERPRISE: {
    stats: true,
    columns: [
      { key: "enterprise_id", label: "ID", sortable: true },
      { key: "enterprise_name", label: "Enterprise Name", sortable: true },
      { key: "enterprise_city", label: "City" },
      { key: "enterprise_state", label: "State" },
      { key: "enterprise_country", label: "Country" },
      { key: "enterprise_status", label: "Status" },
      { key: "created_timestamp", label: "Created At", sortable: true },
      { key: "updated_timestamp", label: "Updated At", type: "datetime",sortable: true },
    ],
    form: [
      {
        name: "enterprise_name",
        label: "Enterprise Name",
        type: "text",
        required: true,
      },
      { name: "enterprise_address_1", label: "Address 1", type: "text" },
      { name: "enterprise_address_2", label: "Address 2", type: "text" },
      { name: "enterprise_city", label: "City", type: "text" },
      { name: "enterprise_state", label: "State", type: "text" },
      { name: "enterprise_zip_code", label: "ZIP Code", type: "text" },
      { name: "enterprise_country", label: "Country", type: "text" },
      { name: "enterprise_logo", label: "Logo URL", type: "text" },
      { name: "enterprise_theme", label: "Theme", type: "text" },
      { name: "enterprise_phone_1", label: "Phone 1", type: "text" },
      { name: "enterprise_phone_2", label: "Phone 2", type: "text" },
      { name: "enterprise_mobile_1", label: "Mobile 1", type: "text" },
      { name: "enterprise_mobile_2", label: "Mobile 2", type: "text" },
      { name: "enterprise_email_1", label: "Email 1", type: "text" },
      { name: "enterprise_email_2", label: "Email 2", type: "text" },
      {
        name: "contact_person_name",
        label: "Contact Person Name",
        type: "text",
      },
      {
        name: "contact_person_phone",
        label: "Contact Person Phone",
        type: "text",
      },
      {
        name: "contact_person_email",
        label: "Contact Person Email",
        type: "text",
      },
      {
        name: "contact_person_mobile",
        label: "Contact Person Mobile",
        type: "text",
      },
      {
        name: "contact_person_designation",
        label: "Contact Person Designation",
        type: "text",
      },
      {
        name: "alt_contact_person_name",
        label: "Alt Contact Name",
        type: "text",
      },
      {
        name: "alt_contact_person_phone",
        label: "Alt Contact Phone",
        type: "text",
      },
      {
        name: "alt_contact_person_email",
        label: "Alt Contact Email",
        type: "text",
      },
      {
        name: "alt_contact_person_mobile",
        label: "Alt Contact Mobile",
        type: "text",
      },
      {
        name: "alt_contact_person_designation",
        label: "Alt Contact Designation",
        type: "text",
      },
      // {
      //   name: "enterprise_status",
      //   label: "Status",
      //   type: "select",
      //   options: [
      //     { label: "Active", value: "active" },
      //     { label: "Inactive", value: "inactive" },
      //   ],
      // },
    ],
  },

  // ===================== AUDIT LOG =====================

  AUDITLOG: {
    stats: true,

    // =====================
    // TABLE COLUMNS
    // =====================

    columns: [
      // {
      //   key: "audit_log_id",
      //   label: "ID",
      //   sortable: true,
      // },

      {
        key: "user_fid",
        label: "User",
        sortable: true,
      },

      {
        key: "enterprise_fid",
        label: "Enterprise_id",
        sortable: true,
      },

      {
        key: "audit_log_action",
        label: "Action",
        sortable: true,
      },

      {
        key: "audit_log_description",
        label: "Description",
      },

      {
        key: "audit_log_ip",
        label: "IP Address",
        sortable: true,
      },

      // {
      //   key: "audit_log_status",
      //   label: "Status",
      // },

      // {
      //   key: "created_by",
      //   label: "Created By",
      // },

      // {
      //   key: "updated_by",
      //   label: "Updated By",
      // },

      // {
      //   key: "created_timestamp",
      //   label: "Created At",
      //   sortable: true,
      // },

      {
        key: "updated_timestamp",
        label: "Updated At",
        sortable: true,
        type: "datetime"
      },
    ],

    // =====================
    // FORM (Usually audit log no create/edit)
    // =====================

    form: [],

    // =====================
    // SEARCH SUPPORT
    // =====================

    search: ["audit_log_action", "audit_log_description", "audit_log_ip"],

    // =====================
    // SORT SUPPORT
    // =====================

    sortable: ["audit_log_id", "audit_log_action", "created_timestamp"],

    // =====================
    // PRIMARY KEY
    // =====================

    primaryKey: "audit_log_id",

    // =====================
    // TITLE FIELD
    // =====================

    titleField: "audit_log_action",
  },
};
