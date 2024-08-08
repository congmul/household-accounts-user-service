import express from "express";
import { userController } from "../controllers";
import msAuthProvider from "../auth/MSAuthProvider";
import googleAuthProvider from "../auth/GoogleAuthProvider";
import config from "../config/config";
import { validate, validCreateUser, validLoginUser } from "../validate";
const { redirect_uri, post_logout_redirect_uri } = config.msalConfig;

const router = express.Router();

router.get(
  "/login/ms",
  msAuthProvider.getAuthCodeUrl({
    scopes: [],
    redirectUri: redirect_uri,
    successRedirect: "/",
  }),
);

router.post(
  "/redirect/ms",
  msAuthProvider.handleRedirect({
    scopes: [],
    redirectUri: redirect_uri,
  }),
);

router.get(
  "/signout-url/ms",
  msAuthProvider.logout({
    postLogoutRedirectUri: post_logout_redirect_uri,
  }),
);

router.get("/login/google", googleAuthProvider.auth());
router.get("/redirect/google", googleAuthProvider.handleRedirect());

router.post("/signup", validate(validCreateUser), userController.createUser);
router.post("/login", validate(validLoginUser), userController.loginUser);

export default router;
