import createClient, { Middleware } from "openapi-fetch";
import { getSession } from "./sessions";
import { Role } from "./types/enums";
import { API_URL } from "./constant";
import { paths } from "./sdk";

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
      const sessionUuid = session.get("sessionUuid") as string;      
      const locale = session.get("locale") as string;
      const userSessionUuid = session.get("userSessionUuid") as string;
      const role = session.get("role");
      if (role != undefined) {
        request.headers.set("Role", role);
      }
      if(role == Role.ROLE_CLIENT) {
        if(userSessionUuid != undefined){
          request.headers.set("User-Session-Uuid", userSessionUuid);
        }
      }


      // console.log("token" bearerToken)
      request.headers.set("Authorization", `Bearer ${bearerToken}`);
      request.headers.set("Active-Company", activeCompany);
      request.headers.set("Accept-Language", locale);
      request.headers.set("Session-Uuid", sessionUuid);
      
      request.headers.set("Session", appRequest.headers.get("Cookie") || "");

      return request;
    },
  };
  return authMiddleware;
};

export default function apiClient({ request }: { request: Request }) {
  console.log("BASE URL",API_URL,process.env.API_URL)
  const client = createClient<paths>({ baseUrl: API_URL });
  client.use(authMiddl(request));
  return client;
}
