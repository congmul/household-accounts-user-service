/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import express from "express";

import authProvider from "../auth/AuthProvider";
import config from "../config/config";
const { redirect_uri, post_logout_redirect_uri } = config.msalConfig;

const router = express.Router();

router.get(
  "/auth-code-url",
  authProvider.getAuthCodeUrl({
    scopes: ["openid", "profile", "offline_access", "User.Read", "email"],
    redirectUri: redirect_uri,
    successRedirect: "/",
  }),
);

router.post(
  "/redirect",
  authProvider.handleRedirect({
    scopes: ["openid", "profile", "offline_access", "User.Read", "email"],
    redirectUri: redirect_uri,
  }),
);

router.get(
  "/signout-url",
  authProvider.logout({
    postLogoutRedirectUri: post_logout_redirect_uri,
  }),
);

export default router;
