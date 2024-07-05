import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../api-docs.json";
const router = Router();

router.use("/api-docs", swaggerUi.serve);
router.get("/api-docs", swaggerUi.setup(swaggerDocument));

export default router;
