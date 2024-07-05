import { cleanEnv, str, makeValidator } from "envalid";
import dotenv from "dotenv";

dotenv.config();

const noEmptyString = makeValidator((str) => {
  if (!str) {
    throw new Error("Cannot be an empty string");
  } else {
    return str;
  }
});

const env = cleanEnv(process.env, {
  PORT: str({ default: "3000" }),
  CLOUD_INSTANCE: noEmptyString(),
  TENANT_ID: noEmptyString(),
  CLIENT_ID: noEmptyString(),
  CLIENT_SECRET: noEmptyString(),
  REDIRECT_URI: noEmptyString(),
  POST_LOGOUT_REDIRECT_URI: noEmptyString(),
  GRAPH_API_ENDPOINT: noEmptyString(),
  EXPRESS_SESSION_SECRET: noEmptyString(),
});

const config = {
  port: env.PORT,
  msalConfig: {
    auth: {
      clientId: env.CLIENT_ID,
      authority: env.CLOUD_INSTANCE + env.TENANT_ID,
      clientSecret: env.CLIENT_SECRET,
    },
    system: {
      loggerOptions: {
        loggerCallback(loglevel: any, message: string, containsPii: any) {
          console.log(message);
        },
        piiLoggingEnabled: false,
        logLevel: 3,
      },
    },
    redirect_uri: env.REDIRECT_URI,
    post_logout_redirect_uri: env.POST_LOGOUT_REDIRECT_URI,
    graph_me_endpoint: env.GRAPH_API_ENDPOINT + "v1.0/me",
  },
  express_session_secret: env.EXPRESS_SESSION_SECRET,
};

export default config;
