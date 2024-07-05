import { connect } from "mongoose";
import config from "./config";

function dbLoader() {
  connect(config.db.URI, { dbName: config.db.DB_NAME })
    .then(() => console.log("Application connected to DB"))
    .catch((err) => console.log("MongoDB connection issue", err));
}

export default dbLoader;
