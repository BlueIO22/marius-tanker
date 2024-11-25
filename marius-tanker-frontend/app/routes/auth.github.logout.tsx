import { authenticator } from "../service/auth.server";

export async function action({ request }: { request: Request }) {
  return await authenticator.logout(request, { redirectTo: "/" });
}
