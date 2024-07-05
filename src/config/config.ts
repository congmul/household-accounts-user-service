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
  MONGO_URI: noEmptyString(),
  MONGO_DB_NAME: noEmptyString(),
  JWT_SECRET: noEmptyString(),
  EXPIRES_IN: str({ default: "1h" }),
  MS_CLOUD_INSTANCE: noEmptyString(),
  MS_TENANT_ID: noEmptyString(),
  MS_CLIENT_ID: noEmptyString(),
  MS_CLIENT_SECRET: noEmptyString(),
  GOOGLE_CLIENT_ID: noEmptyString(),
  GOOGLE_CLIENT_SECRET: noEmptyString(),
  REDIRECT_URI: noEmptyString(),
  POST_LOGOUT_REDIRECT_URI: noEmptyString(),
  GRAPH_API_ENDPOINT: noEmptyString(),
});

const config = {
  port: env.PORT,
  db: {
    URI: env.MONGO_URI,
    DB_NAME: env.MONGO_DB_NAME,
  },
  auth: {
    JWT_SECRET: env.JWT_SECRET,
    EXPIRES_IN: env.EXPIRES_IN,
  },
  msalConfig: {
    auth: {
      clientId: env.MS_CLIENT_ID,
      authority: env.MS_CLOUD_INSTANCE + env.MS_TENANT_ID,
      clientSecret: env.MS_CLIENT_SECRET,
      tenantId: env.MS_TENANT_ID,
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
    redirect_uri: `${env.REDIRECT_URI}/ms`,
    post_logout_redirect_uri: env.POST_LOGOUT_REDIRECT_URI,
    graph_me_endpoint: env.GRAPH_API_ENDPOINT + "v1.0/me",
  },
  googleConfig: {
    CLIENT_ID: env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI: `${env.REDIRECT_URI}/google`,
    POST_LOGOUT_REDIRECT_URI: env.POST_LOGOUT_REDIRECT_URI,
  },
};

export default config;
