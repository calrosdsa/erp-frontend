import createClient, { Middleware } from "openapi-fetch";
import { paths } from "./sdk";
import { validateSession, validateSessionAndGetToken } from "./sessions";

const UNPROTECTED_ROUTES = [ "/auth/signin" ];

const authMiddl = (appRequest:Request) =>{

  const authMiddleware: Middleware = {
    async onRequest({ schemaPath, request }) {
      if (
      UNPROTECTED_ROUTES.some((pathname) => schemaPath.startsWith(pathname))
    ) {
      return undefined; 
    }
    const bearerToken = await validateSessionAndGetToken(appRequest);
    console.log("BEARER TOKEN",bearerToken)
    request.headers.set("Authorization", bearerToken.toString());
    return request;
  },
};
return authMiddleware
}

export default function apiClient({request}:{
  request:Request
}) {
  const client = createClient<paths>({ baseUrl: process.env.API_URL });
  client.use(authMiddl(request));
  return client;
};
