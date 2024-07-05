import express, { Request, Response } from "express";
import cors from "cors";
import config from "./config/config";
import { swaggerRoute, loginRoutes } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", swaggerRoute);
app.use("/login", loginRoutes);

app.get("/health", (req: Request, res: Response) => {
  res.send({
    msg: "Account Service is healthy and ready to handle your requests.",
  });
});

// Start the server on the port
app.listen(3000, () => console.log(`Listening on PORT: ${config.PORT}`));
