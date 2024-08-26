import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import "./global.css";
import "@fontsource/inter";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import { commitSession, getSession, themeSessionResolver } from "./sessions";
import { useChangeLanguage } from "remix-i18next/react";
import { useTranslation } from "react-i18next";
import i18next from "~/i18next.server";
import { ExternalScripts } from "remix-utils/external-scripts";
import { Toaster } from "@/components/ui/toaster";

import { PreventFlashOnWrongTheme, useTheme } from "remix-themes";
import { getThemeSession } from "./util/theme/theme-server";
import { Theme, ThemeProvider } from "./util/theme/theme-provider";
import clsx from "clsx";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.json();
  const session = await getSession(request.headers.get("Cookie"));
  session.set("locale", body.language);
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  // const { getTheme } = await themeSessionResolver(request);
  const themeSession = await getThemeSession(request);

  let _locale = await i18next.getLocale(request);
  if (session.has("locale")) {
    const locale = session.get("locale") || _locale;
    return json({
      locale,
      // theme: getTheme(),
      theme: themeSession.getTheme(),
    });
  } else {
    return json({
      locale: _locale,
      // theme: getTheme(),
      theme: themeSession.getTheme(),
    });
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
  let data = useLoaderData<typeof loader>();
  let { i18n } = useTranslation();
  // This hook will change the i18n instance language to the current locale
  // detected by the loader, this way, when we do something to change the
  // language, this locale will change and i18next will load the correct
  // translation files
  if (data != undefined) {
    useChangeLanguage(data.locale);
  }

  return (
    <html lang={i18n.resolvedLanguage} dir={i18n.dir()} className={clsx(data.theme)}>
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
    <ThemeProvider specifiedTheme={data.theme}>
        {children}
    </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
        <ExternalScripts />
        <Toaster />
      </body>
    </html>
  );
}

export default function App() {
  let data = useLoaderData<typeof loader>();
  return (
      <Outlet />
    // </ThemeProvider>

  );
}

type DefaultSparseErrorPageProps = {
  tagline: string;
  headline: string;
  description: string;
};

function DefaultSparseErrorPage({
  tagline,
  headline,
  description,
}: DefaultSparseErrorPageProps) {
  return (
    <html lang="es" id="app">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="/favicon.ico" type="image/png"></link>
        <Meta />
        <Links />
      </head>
      <body>
        <main className="flex flex-col items-center px-4 py-16 sm:py-32 text-center">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            {tagline}
          </span>
          <h1 className="mt-2 font-bold text-gray-900 tracking-tight text-4xl sm:text-5xl">
            {headline}
          </h1>
          <p className="mt-4 text-base text-gray-500 max-w-full break-words">
            {description}
          </p>
          <div className="mt-6">
            <Link
              to="/home"
              className="text-base font-medium text-primary-600 hover:text-primary-500 inline-flex gap-2
              hover:underline"
            >
              Volve al Inicio
            </Link>
          </div>
        </main>
        <ScrollRestoration />
        <Scripts />
        {/* {devMode && <LiveReload />} */}
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  let tagline = "¡UPS!";
  let headline = "Error inesperado";
  let description =
    "No pudimos procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.";

  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    tagline = `${error.status} error`;
    headline = error.statusText;
    description = error.data;
  }

  return (
    <DefaultSparseErrorPage
      tagline={tagline}
      headline={headline}
      description={description}
    />
  );
}

/**
 * In Remix v2 there will only be a `ErrorBoundary`
 * As mentioned in the jsdoc for `DefaultSparseErrorPage` you should replace this to suit your needs.
 * Relevant for the future: https://remix.run/docs/en/main/route/error-boundary-v2
 */
export function CatchBoundary() {
  return ErrorBoundary();
}
