import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../api-spec.json";
const router = Router();

router.use("/api-spec", swaggerUi.serve);
router.get("/api-spec", swaggerUi.setup(swaggerDocument));

export default router;
