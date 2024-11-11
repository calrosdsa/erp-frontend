import createClient, { Middleware } from "openapi-fetch";
import { API_URL } from "./constant";
import { paths } from "./sdk";
import { getSession } from "./sessions-admin";

const UNPROTECTED_ROUTES = ["/auth/signin"];

const authMiddl = (appRequest: Request) => {
  const authMiddleware: Middleware = {
    async onRequest({ schemaPath, request }) {
      const session = await getSession(appRequest.headers.get("Cookie"));
      const bearerToken = session.get("access_token") as string;
      const locale = session.get("locale") as string;
      const role = session.get("role");
      if (role != undefined) {
        request.headers.set("Role", role);
      }
      request.headers.set("Authorization", `Bearer ${bearerToken}`);
      request.headers.set("Accept-Language", locale);
      
      request.headers.set("Session", appRequest.headers.get("Cookie") || "");

      return request;
    },
  };
  return authMiddleware;
};

export default function apiClientAdmin({ request }: { request: Request }) {
  console.log("BASE URL",API_URL,process.env.API_URL)
  const client = createClient<paths>({ baseUrl: API_URL });
  client.use(authMiddl(request));
  return client;
}
