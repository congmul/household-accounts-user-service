import { cleanEnv, makeValidator } from "envalid";
import { config } from "dotenv";

config();

const noEmptyString = makeValidator((str) => {
  if (!str) {
    throw new Error("Cannot be an empty string");
  } else {
    str
  }
});

const env = cleanEnv(process.env, {
  CLIENT_ID: noEmptyString(),
});

export default env;
