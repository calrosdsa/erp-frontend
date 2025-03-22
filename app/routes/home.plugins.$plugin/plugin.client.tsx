import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AddPluginDrawer } from "./components/AddPlugin";
import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useParams,
  useRouteError,
} from "@remix-run/react";
import { GlobalState } from "~/types/app-types";
import { action, loader } from "./route";
import SquarePlugin from "./plugins/square";
import { Button } from "@/components/ui/button";
import EmailPlugin from "./components/EmailPlugin";

export default function PluginClient() {
  const { t } = useTranslation();
  const { plugin } = useLoaderData<typeof loader>();
  const [openAddPlugin, setOpenAddPlugin] = useState(false);
  const state = useOutletContext<GlobalState>();
  const params = useParams();
  const addPluginfetcher = useFetcher<typeof action>({key:"add-plugin"})
  

  return (
    <>
      {(!addPluginfetcher.data?.success && openAddPlugin && params.plugin != undefined) && (
        <AddPluginDrawer
          open={openAddPlugin}
          close={() => setOpenAddPlugin(false)}
          companies={state.user?.Companies || []}
          session={state.session}
          plugin={params.plugin}
          />
        )}
      <div>
        {(plugin == undefined || plugin.company_plugin.Plugin == "")&& (
          <Button onClick={() => setOpenAddPlugin(true)}>
            {t("addPlugin")}
          </Button>
        )}

        {plugin.company_plugin.Plugin == "email" && 
        <EmailPlugin/>
        }

        {plugin.company_plugin.Plugin == "square" &&
        <SquarePlugin
        companyPlugin={plugin.company_plugin}
        />
        }

      </div>
    </>
  );
}
