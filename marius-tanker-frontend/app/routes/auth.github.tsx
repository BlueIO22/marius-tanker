import { authenticator } from "../service/auth.server";

export async function action({ request }: { request: Request }) {
  return authenticator.authenticate("github", request);
}
