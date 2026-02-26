import { Sequelize } from "sequelize";
import { config } from "./config.js";
import { logger } from "./logger.js";

// if a DATABASE_URL is provided we can delegate everything to Sequelize's
// single-string constructor.  Otherwise fall back to the individual fields.
export const sequelize = config.db.url
  ? new Sequelize(config.db.url, {
      dialect: "postgres",
      logging: false,
    })
  : new Sequelize(
      config.db.name,
      config.db.user,
      config.db.password,
      {
        host: config.db.host,
        port: config.db.port,
        dialect: "postgres",
        logging: false,
      },
    );

export const connectDB = async () => {
  try {
    await sequelize.authenticate();

    console.log("✅ Database connected");
    logger.info("Database connected successfully");

    /**
     * ✅ ONLY FOR DEVELOPMENT
     */
    if (config.nodeEnv === "development") {
      await sequelize.sync({ alter: true });

      console.log("✅ Models synced (Development only)");
      logger.info("Models synced using sequelize.sync()");
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);

    logger.error({
      message: "Database connection failed",
      error: error.message,
      stack: error.stack,
    });

    process.exit(1);
  }
};
