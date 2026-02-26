import dotenv from "dotenv";
dotenv.config();

export default {
  development: {
    // prefer a single URL if available, otherwise fall back to the pieces
    url: process.env.DATABASE_URL,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: "postgres"
  }
};
