import User from "../models/userModel";
import { IUser } from "../types";
import logger from "../utils/logger";

const userService = {
  create: async (userInfo: IUser) => {
    // Check if incomming user exists
    const user = await User.findOne({ email: userInfo.email });
    if (user == null) {
      logger.info("Create a new user");
      const newUser = new User(userInfo);
      await newUser.save();
    }
  },
};

export default userService;
