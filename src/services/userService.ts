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
      const [firstName, ...lastName] = nameArr;
      const data = {
        email: userInfo.email,
        password: userInfo.password,
        fullname: userInfo.fullname,
        firstName,
        lastName: lastName.join(" "),
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
  getUserById: async (userId: string) => {
    try {
      const user = await User.findOne({ _id: userId });
      if (!user) {
        throw {
          message: `There is no matched user with the ID, ${userId}`,
          code: "404",
        };
      }
      return user;
    } catch (err: any) {
      logger.error(err);
      throw new Error("Error during reading a user from DB.");
    }
  },
  getUserByEmail: async (email: string) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw {
          message: `There is no matched user with the email, ${email}`,
          code: "404",
        };
      }
      return user;
    } catch (err: any) {
      logger.error(err);
      throw new Error("Error during reading a user from DB.");
    }
  },
};

export default userService;
