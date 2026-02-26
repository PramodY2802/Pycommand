import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Support a single DATABASE_URL as well as individual pieces.
  db: {
    // full connection string (e.g. postgres://user:pass@host:port/dbname)
    url: process.env.DATABASE_URL,

    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
};
