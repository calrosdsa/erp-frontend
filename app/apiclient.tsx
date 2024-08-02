import createClient, { Middleware } from "openapi-fetch";
import { paths } from "./sdk";
import { getSession } from "./sessions";

const UNPROTECTED_ROUTES = ["/auth/signin"];

const authMiddl = (appRequest: Request) => {
  const authMiddleware: Middleware = {
    async onRequest({ schemaPath, request }) {
      if (
        UNPROTECTED_ROUTES.some((pathname) => schemaPath.startsWith(pathname))
      ) {
        return undefined;
      }

      const session = await getSession(appRequest.headers.get("Cookie"));
      const bearerToken = session.get("access_token") as string;
      const activeCompany = session.get("companyUuid") as string;
      const locale = session.get("locale") as string;

      // console.log("token" bearerToken)
      request.headers.set("Authorization", `Bearer ${bearerToken}`);
      request.headers.set("Active-Company", activeCompany);
      request.headers.set("Accept-Language", locale);

      return request;
    },
  };
  return authMiddleware;
};

export default function apiClient({ request }: { request: Request }) {
  const client = createClient<paths>({ baseUrl: process.env.API_URL });
  client.use(authMiddl(request));
  return client;
}
