/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import express from "express";

import msAuthProvider from "../auth/MSAuthProvider";
import googleAuthProvider from "../auth/GoogleAuthProvider";
import config from "../config/config";
const { redirect_uri, post_logout_redirect_uri } = config.msalConfig;

const router = express.Router();

router.get(
  "/auth-code-url/ms",
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

router.get("/auth-code-url/google", googleAuthProvider.getAuthCodeUrl());
router.get("/redirect/google", googleAuthProvider.handleRedirect());

export default router;
