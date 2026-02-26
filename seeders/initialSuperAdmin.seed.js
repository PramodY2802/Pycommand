// seeders/initialSuperAdmin.seed.js
import bcrypt from "bcrypt";
import { sequelize } from "../config/database.js";
import { User, Enterprise, Page } from "../models/index.js";

const seedSuperAdmin = async () => {
  try {
    // Optional: create a default enterprise
    const [enterprise] = await Enterprise.findOrCreate({
      where: { enterprise_name: "Default Enterprise" },
      defaults: {
        enterprise_status: "active",
        created_by: null,
        updated_by: null,
      },
    });

    // Check if superadmin already exists
    const existing = await User.findOne({ where: { user_name: "pramod" } });
    if (existing) {
      console.log("Superadmin user already exists");
      return;
    }

    // Hash the password
    const passwordHash = await bcrypt.hash("pramod@123", 10);

    // Create superadmin user
    const superAdmin = await User.create({
      enterprise_fid: enterprise.enterprise_id,
      user_fullname: "Pramod Yadav",
      user_name: "pramod",
      user_email: "pramod.y@nextastra.com",
      user_password: passwordHash,
      is_super_admin: true,
      user_status: "active",
      created_by: null,
      updated_by: null,
    });

    // ⭐ Add page records with production-safe duplicate prevention
    const pagesData = [
      {
        enterprise_fid: enterprise.enterprise_id,
        page_name: "Page Management",
        page_route: "/superadmin/pages",
        model_name: "Page",
        page_api: "/api/pages",
        page_icon: "list",
        is_active: true,
        page_status: "active",
        created_by: superAdmin.user_id,
        updated_by: superAdmin.user_id,
      },
    ];

    // Use findOrCreate to prevent duplicate records in production
    for (const pageData of pagesData) {
      await Page.findOrCreate({
        where: { page_name: pageData.page_name },
        defaults: pageData,
      });
    }

    console.log("✅ Pages initialized successfully!");
    console.log("✅ Superadmin user created successfully!");

  } catch (error) {
    console.error("❌ Failed to create superadmin:", error);
  } finally {
    await sequelize.close();
  }
};

// Run the seeder if this file is executed directly
if (process.argv[1].includes("initialSuperAdmin.seed.js")) {
  seedSuperAdmin();
}

export default seedSuperAdmin;