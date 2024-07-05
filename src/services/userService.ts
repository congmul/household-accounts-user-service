import User from "../models/userModel";
import { IUser } from "../types";

const userService = {
  create: async (userInfo: IUser) => {
    // Check if incomming user exists
    const user = await User.findOne({ email: userInfo.email });
    if (user == null) {
      const newUser = new User(userInfo);
      await newUser.save();
    }
  },
};

export default userService;
