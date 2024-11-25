import { authenticator } from "../service/auth.server";

export async function loader({ request }: { request: Request }) {
  return authenticator.authenticate("github", request, {
    successRedirect: "/",
    failureRedirect: "/",
  });
}
