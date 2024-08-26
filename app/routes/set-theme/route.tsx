import { ActionFunctionArgs, json, LoaderFunction, redirect } from "@remix-run/node";
import { isTheme } from "~/util/theme/theme-provider";
import { getThemeSession } from "~/util/theme/theme-server";


export const action = async ({ request }:ActionFunctionArgs) => {
  const themeSession = await getThemeSession(request);
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const theme = form.get('theme');
  console.log("FORM THEME",theme)
  if (!isTheme(theme)) {
    return json({
      success: false,
      message: `theme value of ${theme} is not a valid theme`,
    });
  }

  themeSession.setTheme(theme);
  return json(
    { success: true },
    { headers: { 'Set-Cookie': await themeSession.commit() } }
  );
};

export const loader: LoaderFunction = () => redirect('/', { status: 404 });