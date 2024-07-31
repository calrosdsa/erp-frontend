import DrawerAnchor from "~/components/shared/drawer/Drawer";
import PluginClient from "./plugin.client";
import { json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  console.log(params.plugin);
  const res = await apiClient({ request }).GET(`/plugin/{plugin}`, {
    params: {
      path: {
        plugin: params.plugin as string,
      },
    },
  });
  console.log(res.error);
  if (res.error != undefined) {
    throw new Response(res.error.detail,{
        status:res.error.status,
        statusText:res.error.title
    });
  }
  return json({
    plugin: res.data,
    error: res.error,
  });
};

export default function Plugin() {
  return <PluginClient />;
}
