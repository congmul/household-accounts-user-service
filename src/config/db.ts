import { connect } from "mongoose";
import config from "./config";
import logger from "../utils/logger";

function dbLoader() {
  connect(config.db.URI, { dbName: config.db.DB_NAME })
    .then(() => logger.info("Application connected to DB"))
    .catch((err) => logger.error("MongoDB connection issue", err));
}

export default dbLoader;
