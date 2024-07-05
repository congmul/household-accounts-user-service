import { cleanEnv, str, makeValidator } from "envalid";
import { config } from "dotenv";

config();

const noEmptyString = makeValidator((str) => {
  if (!str) {
    throw new Error("Cannot be an empty string");
  } else {
    return str;
  }
});

const env = cleanEnv(process.env, {
  CLIENT_ID: noEmptyString(),
  PORT: str({ default: "3000" }),
});

export default env;
