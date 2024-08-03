import User from "../models/userModel";
import { IUser } from "../types";
import logger from "../utils/logger";
import { createJwt } from "../utils/jwtHandler";
import AppError from "../utils/errorHandler";

const userService = {
  create: async (userInfo: IUser) => {
    // Check if incomming user exists

    const user = await User.findOne({ email: userInfo.email })
      .select("-password")
      .lean();
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
      const user = await User.findOne({ email: userInfo.email })
        .select("-password")
        .lean();
      const accessToken = await createJwt({ ...user });
      return { userInfo: { ...user }, accessToken };
    } else {
      logger.info("Login a user and create Access token");
      const accessToken = await createJwt({ ...user });
      return { userInfo: { ...user }, accessToken };
    }
  },
  getUserById: async (userId: string) => {
    try {
      const user = await User.findOne({ _id: userId }).select("-password");
      if (!user) {
        throw new AppError(
          `There is no matched user with the ID, ${userId}.`,
          404,
        );
      }
      return user;
    } catch (err: any) {
      logger.error(err);
      if (err.statusCode === 404) {
        throw new AppError(err.message, err.statusCode);
      } else {
        throw new AppError("Error during reading a user from DB.", 500);
      }
    }
  },
  getUserByEmail: async (email: string) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new AppError(
          `There is no matched user with the email, ${email}.`,
          404,
        );
      }
      return user;
    } catch (err: any) {
      logger.error(err);
      if (err.statusCode === 404) {
        throw err;
      } else {
        throw new Error("Error during reading a user from DB.");
      }
    }
  },
};

export default userService;
