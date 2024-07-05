import msal from "@azure/msal-node";
import axios from "axios";
import config from "../config/config";
import logger from "../utils/logger";
import { userService } from "../services";

class AuthProvider {
  msalConfig: any;
  cryptoProvider: any;

  constructor(msalConfig: any) {
    this.msalConfig = msalConfig;
    this.cryptoProvider = new msal.CryptoProvider();
  }

  getAuthCodeUrl(options: any = {}) {
    return async (req: any, res: any, next: any) => {
      /**
       * MSAL Node library allows you to pass your custom state as state parameter in the Request object.
       * The state parameter can also be used to encode information of the app's state before redirect.
       * You can pass the user's state in the app, such as the page or view they were on, as input to this parameter.
       */
      const state = this.cryptoProvider.base64Encode(
        JSON.stringify({
          successRedirect: options.successRedirect || "/",
        }),
      );

      const authCodeUrlRequestParams = {
        state: state,

        /**
         * By default, MSAL Node will add OIDC scopes to the auth code url request. For more information, visit:
         * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
         */
        scopes: options.scopes || [],
        redirectUri: options.redirectUri,
      };

      /**
       * If the current msal configuration does not have cloudDiscoveryMetadata or authorityMetadata, we will
       * make a request to the relevant endpoints to retrieve the metadata. This allows MSAL to avoid making
       * metadata discovery calls, thereby improving performance of token acquisition process. For more, see:
       * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/performance.md
       */
      if (
        !this.msalConfig.auth.cloudDiscoveryMetadata ||
        !this.msalConfig.auth.authorityMetadata
      ) {
        const [cloudDiscoveryMetadata, authorityMetadata] = await Promise.all([
          this.getCloudDiscoveryMetadata(this.msalConfig.auth.authority),
          this.getAuthorityMetadata(this.msalConfig.auth.authority),
        ]);

        this.msalConfig.auth.cloudDiscoveryMetadata = JSON.stringify(
          cloudDiscoveryMetadata,
        );
        this.msalConfig.auth.authorityMetadata =
          JSON.stringify(authorityMetadata);
      }
      const msalInstance = this.getMsalInstance(this.msalConfig);

      // trigger the first leg of auth code flow
      return this.redirectToAuthCodeUrl(authCodeUrlRequestParams, msalInstance)(
        req,
        res,
        next,
      );
    };
  }

  handleRedirect(options: any = {}) {
    return async (req: any, res: any, next: any) => {
      if (!req.body || !req.body.state) {
        return next(new Error("Error: response not found"));
      }

      const authCodeRequest = {
        state: req.body.state,
        scopes: options.scopes || [],
        redirectUri: options.redirectUri,
        code: req.body.code,
      };

      try {
        logger.info("MS Redirect API");
        const msalInstance = this.getMsalInstance(this.msalConfig);
        const tokenResponse = await msalInstance.acquireTokenByCode(
          authCodeRequest,
          req.body,
        );
        const { userInfo, accessToken } = await userService.create({
          email: tokenResponse.account?.username || "",
          fullname: tokenResponse.account?.name || "",
          joinThrough: "microsoft",
        });
        res.status(200).send({
          userInfo,
          tokens: { accessToken, idToken: tokenResponse.idToken },
        });
      } catch (error) {
        next(error);
      }
    };
  }

  logout(options: any = {}) {
    return (req: any, res: any, next: any) => {
      /**
       * Construct a logout URI and redirect the user to end the
       * session with Azure AD. For more information, visit:
       * https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
       */
      let logoutUri = `${this.msalConfig.auth.authority}/oauth2/v2.0/`;

      if (options.postLogoutRedirectUri) {
        logoutUri += `logout?post_logout_redirect_uri=${options.postLogoutRedirectUri}`;
      }

      res.send({ logoutUri });
    };
  }

  /**
   * Instantiates a new MSAL ConfidentialClientApplication object
   * @param msalConfig: MSAL Node Configuration object
   * @returns
   */
  getMsalInstance(msalConfig: any) {
    return new msal.ConfidentialClientApplication(msalConfig);
  }

  /**
   * Prepares the auth code request parameters and initiates the first leg of auth code flow
   * @param req: Express request object
   * @param res: Express response object
   * @param next: Express next function
   * @param authCodeUrlRequestParams: parameters for requesting an auth code url
   * @param authCodeRequestParams: parameters for requesting tokens using auth code
   */
  redirectToAuthCodeUrl(authCodeUrlRequestParams: any, msalInstance: any) {
    return async (req: any, res: any, next: any) => {
      /**
       * By manipulating the request objects below before each request, we can obtain
       * auth artifacts with desired claims. For more information, visit:
       * https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_node.html#authorizationurlrequest
       * https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_node.html#authorizationcoderequest
       **/
      const authCodeUrlRequest = {
        ...authCodeUrlRequestParams,
        responseMode: msal.ResponseMode.FORM_POST, // recommended for confidential clients
      };
      try {
        const authCodeUrlResponse =
          await msalInstance.getAuthCodeUrl(authCodeUrlRequest);
        // res.send({ authCodeUrl: authCodeUrlResponse });
        res.redirect(authCodeUrlResponse);
      } catch (error) {
        next(error);
      }
    };
  }

  /**
   * Retrieves cloud discovery metadata from the /discovery/instance endpoint
   * @returns
   */
  async getCloudDiscoveryMetadata(authority: any) {
    const endpoint =
      "https://login.microsoftonline.com/common/discovery/instance";

    try {
      const response = await axios.get(endpoint, {
        params: {
          "api-version": "1.1",
          authorization_endpoint: `${authority}/oauth2/v2.0/authorize`,
        },
      });

      return await response.data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Retrieves oidc metadata from the openid endpoint
   * @returns
   */
  async getAuthorityMetadata(authority: any) {
    const endpoint = `${authority}/v2.0/.well-known/openid-configuration`;

    try {
      const response = await axios.get(endpoint);
      return await response.data;
    } catch (error) {
      logger.error(error);
    }
  }
}

const authProvider = new AuthProvider(config.msalConfig);

export default authProvider;
