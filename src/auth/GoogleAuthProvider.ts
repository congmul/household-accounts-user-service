import config from "../config/config";
import axios from "axios";

class AuthProvider {
  googleConfig: any;

  constructor(googleConfig: any) {
    this.googleConfig = googleConfig;
  }

  getAuthCodeUrl() {
    return async (req: any, res: any, next: any) => {
      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${this.googleConfig.CLIENT_ID}&redirect_uri=${this.googleConfig.REDIRECT_URI}&response_type=code&scope=profile email`;
      res.send({ authCodeUrl: url });
    };
  }

  handleRedirect() {
    return async (req: any, res: any, next: any) => {
      const { code } = req.query;

      try {
        // Exchange authorization code for access token
        const { data } = await axios.post(
          "https://oauth2.googleapis.com/token",
          {
            client_id: this.googleConfig.CLIENT_ID,
            client_secret: this.googleConfig.CLIENT_SECRET,
            code,
            redirect_uri: this.googleConfig.REDIRECT_URI,
            grant_type: "authorization_code",
          },
        );

        const { access_token, id_token } = data;

        // Use access_token or id_token to fetch user profile
        const { data: profile } = await axios.get(
          "https://www.googleapis.com/oauth2/v1/userinfo",
          {
            headers: { Authorization: `Bearer ${access_token}` },
          },
        );

        // Code to handle user authentication and retrieval using the profile data
        console.log(profile);
        res.send({ profile });
        // res.redirect('/');
      } catch (error) {
        console.log(error);
      }
    };
  }
}

const authProvider = new AuthProvider(config.googleConfig);

export default authProvider;
