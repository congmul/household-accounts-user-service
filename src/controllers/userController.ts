import logger from "../utils/logger";
import passwordHash from "../utils/hashHandler";
import { userService } from "../services";
import User from "../models/userModel";

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
      const user = await User.findOne({ email: req.body.email }).lean();
      if (user == null || user.password == null) {
        return res.status(404).send({ msg: "There is no matched user" });
      }
      const isMatched = await passwordHash.compare(
        req.body.password,
        user.password,
      );
      if (isMatched) {
        const response = await userService.create({ ...user });
        res.status(200).send(response);
      }
    } catch (err) {
      logger.error(err);
      res.status(500).send(err);
    }
  },
};

export default userController;
