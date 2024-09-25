import express, { Request, Response } from "express";
import * as appInsights from "applicationinsights";
import cors from "cors";
import config from "./config/config";
import dbLoader from "./config/db";
import { swaggerRoute, authRoutes, userRoutes } from "./routes";
import logger from "./utils/logger";
// appInsights.setup(config.appInsights.APP_INSIGHTS_CONN_STRING).start();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbLoader();

app.use("/", swaggerRoute);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.send({
    msg: "Account Service is healthy and ready to handle your requests.",
    app_version: process.env.npm_package_version,
  });
});

// Start the server on the port
app.listen(config.port, () => logger.info(`Listening on PORT: ${config.port}`));
