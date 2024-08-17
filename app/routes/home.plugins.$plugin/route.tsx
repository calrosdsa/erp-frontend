import PluginClient from "./plugin.client";
import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { addPluginFormSchema } from "./components/AddPlugin";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  console.log(params.plugin);
  const res = await apiClient({ request }).GET(`/plugin/{plugin}`, {
    params: {
      path: {
        plugin: params.plugin as string,
      },
    },
  });
  console.log("PLUGIN RES", res.error, res.data);
  if (res.error != undefined) {
    throw new Response(res.error.detail, {
      status: res.error.status,
      statusText: res.error.title,
    });
  }
  return json({
    plugin: res.data,
    error: res.error,
  });
};

type ActionData = {
  action:string
  addPlugin:z.infer<typeof addPluginFormSchema>
}
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const reqData:ActionData = await request.json();
  let success: boolean = false;
  if (action != undefined) {
    switch (reqData.action) {
      case "add-plugin": {
        const addPlugin = reqData.addPlugin;
        console.log("PLUGIN", addPlugin);
        if (addPlugin == undefined) {
          throw new Response("Error");
        }
        const res = await apiClient({ request }).POST("/plugin", {
          body: {
            plugin: addPlugin.plugin,
          },
        });
        if (res.error != undefined) {
          throw new Response(res.error.detail, {
            status: res.error.status,
            statusText: res.error.title,
          });
        }

        success = true;
        // console.log("ACCESS TOKEN", res.error, res.data);  
        break;
      }
      case "update-credentials": {
        // const accessToken = formData.get("accessToken");
        // const applicationId = formData.get("applicationId");
        // const locationId = formData.get("locationId");
        // const apiVersion = formData.get("apiVersion");
        // const credentials = JSON.stringify({
        //   accessToken,
        //   applicationId,
        //   locationId,
        //   apiVersion,
        // });
        
        // const res = await apiClient({ request }).PUT("/plugin/{plugin}", {
        //   body: {
        //     credentials: credentials,
        //   },
        //   params: {
        //     path: {
        //       plugin: params.plugin as string,
        //     },
        //   },
        // });
        // console.log("ACCESS TOKEN", res.error, res.data);
        // success = true;

        break;
      }
    }
  }
  return json({
    success,
  });
};

export default function Plugin() {
  return <PluginClient />;
}
