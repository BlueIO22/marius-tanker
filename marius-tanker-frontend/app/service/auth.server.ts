import { GitHubStrategy } from "remix-auth-github";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";

import * as crypto from "node:crypto";
Object.defineProperty(globalThis, "crypto", {
  value: crypto.webcrypto,
  configurable: true,
  writable: true,
});

const gitHubStrategy = new GitHubStrategy(
  {
    clientId: process.env.GITHUB_AUTH_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_AUTH_SECRET ?? "",
    redirectURI: "https://marius-tanker.no/auth/github/callback",
  },
  async ({ accessToken, extraParams, profile }) => {
    return profile;
  }
);

export const authenticator = new Authenticator(sessionStorage);
authenticator.use(gitHubStrategy);
