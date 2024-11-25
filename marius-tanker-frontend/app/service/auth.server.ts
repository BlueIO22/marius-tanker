import { GitHubStrategy } from "remix-auth-github";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";

const gitHubStrategy = new GitHubStrategy(
  {
    clientId: process.env.GITHUB_AUTH_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_AUTH_SECRET ?? "",
    redirectURI:
      process.env.NODE_ENV === "development"
        ? "http://localhost:5173/auth/github/callback"
        : "https://marius-tanker.no/auth/github/callback",
  },
  async ({ accessToken, extraParams, profile }) => {
    return profile;
  }
);

export const authenticator = new Authenticator(sessionStorage);
authenticator.use(gitHubStrategy);
