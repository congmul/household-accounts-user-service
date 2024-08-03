import { Request, Response } from "express";
import logger from "../utils/logger";
import passwordHash from "../utils/hashHandler";
import { userService } from "../services";

const userController = {
  createUser: async (req: any, res: any) => {
    try {
      const hashedPass = await passwordHash.hash(req.body.password);
      await userService.create({
        ...req.body,
        password: hashedPass,
        joinThrough: "custom",
      });
      res.status(201).send({ msg: "New user created successfully" });
    } catch (err) {
      logger.error(err);
      res.status(500).send(err);
    }
  },
  loginUser: async (req: any, res: any) => {
    try {
      const user = await userService.getUserByEmail(req.body.email);

      if (!user.password) {
        return res.status(404).send({
          message: `There is no matched user with the email, ${req.body.email}`,
        });
      }
      const isMatched = await passwordHash.compare(
        req.body.password,
        user.password,
      );
      if (isMatched) {
        console.log(user, "in matched");
        const response = await userService.create(user);
        res.status(200).send(response);
      }
    } catch (err: any) {
      logger.error(err);
      if (err.code === "404") {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send(err);
      }
    }
  },
  getUser: async (req: Request, res: Response) => {
    try {
      let user: any;
      if (req.params.type === "email") {
        user = await userService.getUserByEmail(req.params.identifier);
      } else {
        user = await userService.getUserById(req.params.identifier);
      }
      res.status(200).send(user);
    } catch (err: any) {
      logger.error(err);
      if (err.statusCode === 404) {
        res.status(404).send({ message: err.message });
      } else {
        res.status(500).send(err);
      }
    }
  },
  checkExist: async (req: Request, res: Response) => {
    try {
      await userService.getUserById(req.params.userId);
      res.status(200).send({ message: "user exists." });
    } catch (err: any) {
      logger.error(err);
      if (err.statusCode === 404) {
        res.status(404).send({ message: "user not found" });
      } else {
        res.status(500).send(err);
      }
    }
  },
};

export default userController;
