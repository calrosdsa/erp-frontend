import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import "./tailwind.css";
import '@fontsource/inter';
import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { commitSession, getSession } from "./sessions";
import { useChangeLanguage } from "remix-i18next/react";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";
import { ExternalScripts } from "remix-utils/external-scripts";
import { useEffect } from "react";


export async function action({request}:ActionFunctionArgs) { 
  const body = await request.json()
  const session = await getSession(
    request.headers.get("Cookie")
  );
  session.set("locale",body.language)
  return redirect('/', {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  })
}

export async function loader({ request }: LoaderFunctionArgs) {

  const session = await getSession(
    request.headers.get("Cookie")
  );
 
	let _locale = await i18next.getLocale(request);
  if(session.has("locale")){
    const locale = session.get("locale") || _locale
    return json({ locale });
  }else{
    return json({ locale:_locale})
  }

}
export let handle = {
	// In the handle export, we can add a i18n key with namespaces our route
	// will need to load. This key can be a single string or an array of strings.
	// TIP: In most cases, you should set this to your defaultNS from your i18n config
	// or if you did not set one, set it to the i18next default namespace "translation"
	i18n: "common",
};

export function Layout({ children }: { children: React.ReactNode }) {
  let { locale } = useLoaderData<typeof loader>();

	let { i18n } = useTranslation();

	// This hook will change the i18n instance language to the current locale
	// detected by the loader, this way, when we do something to change the
	// language, this locale will change and i18next will load the correct
	// translation files
  useChangeLanguage(locale)
  
  return (
    <html lang={i18n.resolvedLanguage} dir={i18n.dir()}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <script
        type="text/javascript"
        src="https://sandbox.web.squarecdn.com/v1/square.js"
        defer
      ></script> */}
        <Meta />
        <Links />
      </head>
      <body>
   
        {children}
        <ScrollRestoration />
        <Scripts />
        <ExternalScripts/>
        
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
