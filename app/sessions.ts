// app/sessions.ts
import { createCookieSessionStorage, redirect } from "@remix-run/node"; // or cloudflare/deno

type SessionData = {
  access_token: string;
  locale:string
};

type SessionFlashData = {
  error: string;
};

const validateSessionAndGetToken = async(request:Request) =>{
  const session = await getSession(
    request.headers.get("Cookie")
  );
  if (!session.has("access_token")) {
    // Redirect to the home page if they are already signed in.
    console.log("REDIRECT")
    return redirect("/signin"); 
  }
  const token = session.get("access_token")
  if(token == undefined){
    return redirect("/signin")
  }
  const bearerToken = `Bearer ${token}`
  return bearerToken
}
const validateSession = async(request:Request) =>{
  const session = await getSession(
    request.headers.get("Cookie")
  );
  if (!session.has("access_token")) {
    // Redirect to the home page if they are already signed in.
    return redirect("/signin"); 
  }
}

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
        maxAge: 60000,
        path: "/",
        sameSite: "lax",
        secrets: ["s3cret1"],
        secure: true,
      },
    }
  );

export { getSession, commitSession, destroySession,validateSession,validateSessionAndGetToken };