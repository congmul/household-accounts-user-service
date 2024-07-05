import jwt from "jsonwebtoken";
import axios from "axios";
import config from "../config/config";
import logger from "./logger";

// Function to get the public keys from Azure AD
async function getSigningKeys() {
  const jwksUrl = `https://login.microsoftonline.com/${config.msalConfig.auth.tenantId}/discovery/v2.0/keys`;
  const response = await axios.get(jwksUrl);
  return response.data.keys;
}

// Function to verify and decode the token
async function verifyMSIDToken(token: string) {
  const keys = await getSigningKeys();

  // Decode the token to get the header
  const decodedToken = jwt.decode(token, { complete: true });
  const kid = decodedToken && decodedToken.header.kid;

  // Find the signing key that matches the 'kid' in the token header
  const signingKey = keys.find((key: any) => key.kid === kid);
  if (!signingKey) {
    throw new Error("Signing key not found");
  }
  logger.debug("signingKey", signingKey);
  // Construct the public key
  const publicKey = `-----BEGIN CERTIFICATE-----\n${signingKey.x5c[0]}\n-----END CERTIFICATE-----`;

  // Verify the token using the public key
  return jwt.verify(token, publicKey, { algorithms: ["RS256"] });
}

async function createJwt(data: any) {
  try {
    const token = jwt.sign(data, config.auth.JWT_SECRET, {
      expiresIn: config.auth.EXPIRES_IN,
    });
    return token;
  } catch (err) {
    logger.error("within createJwt", err);
    throw err;
  }
}

export { verifyMSIDToken, createJwt };
