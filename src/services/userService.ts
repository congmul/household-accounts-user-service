import User from "../models/userModel";
import { IUser } from "../types";
import logger from "../utils/logger";
import { createJwt } from "../utils/jwtHandler";

const userService = {
  create: async (userInfo: IUser) => {
    // Check if incomming user exists

    const user = await User.findOne({ email: userInfo.email }).lean();
    if (user == null) {
      logger.info("Create a new user");
      const nameArr = userInfo.fullname.split(" ");
      const [firstName, lastName] = nameArr;
      const data = {
        email: userInfo.email,
        fullname: userInfo.fullname,
        firstName,
        lastName,
        joinThrough: userInfo.joinThrough,
      };
      const newUser = new User(data);
      await newUser.save();
      const user = await User.findOne({ email: userInfo.email }).lean();
      const accessToken = await createJwt({ ...user });
      return { userInfo: { ...user }, accessToken };
    } else {
      const accessToken = await createJwt({ ...user });
      return { userInfo: { ...user }, accessToken };
    }
  },
};

export default userService;
