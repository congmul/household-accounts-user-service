import config from "../config/config";
import logger from "../utils/logger";
import { userService } from "../services";
import { OAuth2Client } from "google-auth-library";

class AuthProvider {
  client: any;
  constructor(OAuth2Client: any) {
    this.client = OAuth2Client;
  }
  auth() {
    // First function for google auth, then  redirect to handleRedirect Function.
    return (req: any, res: any) => {
      logger.info("Auth google");
      const authorizeUrl = this.client.generateAuthUrl({
        access_type: "offline",
        scope: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
        ],
      });
      res.send({ authorizeUrl });
    };
  }
  handleRedirect() {
    return async (req: any, res: any, next: any) => {
      logger.info("Login Redirect process");

      const { code } = req.query;
      try {
        // Exchange authorization code for access token
        const r = await this.client.getToken(code);
        const idToken = r.tokens.id_token;
        const ticket = await this.client.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        const { userInfo, accessToken } = await userService.create({
          email: payload.email || "",
          fullname: payload.name || "",
          joinThrough: "google",
        });
        // / Redirect to client with query parameters
        res.redirect(
          `${config.client_url}/login-process?accessToken=${accessToken}&userInfo=${encodeURIComponent(JSON.stringify(userInfo))}`,
        );
      } catch (error) {
        console.log(error);
        res.status(500).json(error);
      }
    };
  }
}

const authProvider = new AuthProvider(
  new OAuth2Client(
    config.googleConfig.CLIENT_ID,
    config.googleConfig.CLIENT_SECRET,
    config.googleConfig.REDIRECT_URI,
  ),
);

export default authProvider;
