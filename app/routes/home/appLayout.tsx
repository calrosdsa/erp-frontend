import * as React from "react";
import { useLoaderData, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app-types";
import { useSessionDefaults } from "./components/SessionDefaults";
import GlobalDialogs from "./components/dialogs";
import { useToolbar } from "~/util/hooks/ui/use-toolbar";
import { useUnmount } from "usehooks-ts";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { loader } from "./route";
import { WsHandler } from "./ws-handler";
import { Navbar } from "./components/navbar";
import ChatModal from "../home.chat/components/chat-modal";

type RouteItem = {
  name: string;
  link: string;
};

export default function AppLayout({
  children,
  globalState,
}: {
  children: React.ReactNode;
  globalState: GlobalState;
}) {
  const location = useLocation();
  const { t } = useTranslation("common");
  const sessionDefaults = useSessionDefaults();
  const [routesName, setRoutesName] = React.useState<string[]>([]);
  const { session, modules } = useLoaderData<typeof loader>();
  const readyState = WsHandler({
    accessToken: session.access_token,
    sessionUUID: session.sessionUuid,
  });

  const toolbar = useToolbar();

  const getRoutes = () => {
    const routesName = location.pathname.split("/").map((word) => word);
    setRoutesName(routesName.slice(2));
  };

  const getRouteName = () => {
    const path = location.pathname.split("/");
    const route = path.slice(-1)[0];
    return t(decodeURIComponent(route || ""));
  };

  useUnmount(() => {
    toolbar.setToolbar({});
  });

  React.useEffect(() => {
    getRoutes();
    // if(toolbar.isMounted){
    //   console.log("RESET TOOLBAR")
    //   toolbar.resetState()
    // }
  }, [location.pathname]);
  React.useEffect(() => {
    sessionDefaults.onOpenChange(false);
  }, [location]);
  return (
    <>
      <ChatModal appContext={globalState} />
      <GlobalDialogs globalState={globalState} />
      <div className=" max-w-[1500px] mx-auto">
        <SidebarProvider >
          <AppSidebar data={globalState} modules={modules} />
          <SidebarInset>
            <Navbar />
            <div
              className="
              px-2 
              md:px-6 
              pb-2 
              sm:pb-2 
              md:pb-3 
              flex 
              flex-col 
              min-w-0 
              h-custom-dvh 
              gap-1
            "
            >
              {/* <ToolBar title={getRouteName()} /> */}

              <div className="h-full  max-w-[1500px]">{children}</div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
}
