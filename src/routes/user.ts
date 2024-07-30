import express from "express";
import { validate, validGetUser } from "../validate";
import { userController } from "../controllers";

const router = express.Router();

router.get("/:identifier", validate(validGetUser), userController.getUser);

export default router;
