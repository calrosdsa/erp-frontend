// app/sessions.ts
import { createCookieSessionStorage, redirect } from "@remix-run/node"; // or cloudflare/deno

export type SessionData = {
  access_token: string;
  locale:string
  companyUuid:string
  role:string
  userSessionUuid:string
  sessionUuid:string
};

type SessionFlashData = {
  error: string;
};




const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>(
    {
      // a Cookie from `createCookie` or the CookieOptions to create one
      cookie: {
        name: "__session",
        // all of these are optional
        // domain: "teclu",
        // Expires can also be set (although maxAge overrides it when used in combination).
        // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
        //
        // expires: new Date(Date.now() + 60_000),
        httpOnly: true,
        maxAge: 80000,
        path: "/",
        sameSite: "lax",
        secrets: ["s3cret1"],
        secure: false,
      },
    }
  );

export { getSession, commitSession, destroySession };


// const themeSessionStorage = createCookieSessionStorage({
//   cookie: {
//     name: '__remix-themes',
//     path: "/",
//     httpOnly: true,
//     sameSite: "lax",
//     secrets: ["s3cr3t"],
//     // Set domain and secure only if in production
//     // ...(isProduction
//     //   ? { domain: "your-production-domain.com", secure: true }
//     //   : {}),
//   },
// })
 
// export const themeSessionResolver = createThemeSessionResolver(themeSessionStorage)