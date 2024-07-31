import express from "express";
import { validate, validGetUser, validCheckExist } from "../validate";
import { userController } from "../controllers";

const router = express.Router();

router.get("/:identifier", validate(validGetUser), userController.getUser);
router.get(
  "/check-exist/:userId",
  validate(validCheckExist),
  userController.checkExist,
);

export default router;
