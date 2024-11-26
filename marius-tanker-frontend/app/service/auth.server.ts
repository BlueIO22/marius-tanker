import { GitHubStrategy } from "remix-auth-github";
import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";

console.log(process.env.GITHUB_AUTH_CLIENT_ID, process.env.GITHUB_AUTH_SECRET);

const gitHubStrategy = new GitHubStrategy(
  {
    clientId: process.env.GITHUB_AUTH_CLIENT_ID ?? "",
    clientSecret: process.env.GITHUB_AUTH_SECRET ?? "",
    redirectURI: "https://marius-tanker.no/auth/github/callback",
  },
  async ({ accessToken, extraParams, profile }) => {
    console.log(accessToken, extraParams, profile);
    return profile;
  }
);

console.error(gitHubStrategy);

export const authenticator = new Authenticator(sessionStorage);
authenticator.use(gitHubStrategy);
