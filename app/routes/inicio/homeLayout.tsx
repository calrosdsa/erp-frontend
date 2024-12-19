import * as React from "react";
import { Link, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app";
import {
  SessionDefaultDrawer,
  useSessionDefaults,
} from "./components/SessionDefaults";
import { HomeIcon } from "lucide-react";
import GlobalDialogs from "./components/dialogs";
import ToolBar from "@/components/layout/toolbar/Toolbar";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { useUnmount } from "usehooks-ts";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/layout/theme-toggle";


export default function HomeLayout({
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

  const toolbar = useToolbar();

  const getRoutes = () => {
    const routesName = location.pathname.split("/").map((word) => word);
    setRoutesName(routesName.slice(2));
  };

  const getRoute = (index: number) => {
    const route = location.pathname
      .split("/")
      .slice(0, index + 3)
      .join("/");
    return route;
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
      <GlobalDialogs globalState={globalState} />

      <div className=" max-w-[1400px] mx-auto">
        <SidebarProvider>
          <AppSidebar data={globalState} />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 justify-between">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                {/* <Breadcrumb aria-label="breadcrumbs">
                  <BreadcrumbList>
                    <BreadcrumbItem key="home">
                      <BreadcrumbLink asChild>
                        <Link
                          to="/home"
                          className="hover:underline"
                          aria-label="Home"
                        >
                          <HomeIcon size={15} />
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {routesName.slice(0, -1).map((item, idx) => (
                      <React.Fragment key={`breadcrumb-${idx}`}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbLink asChild>
                            <Link
                              to={getRoute(idx)}
                              aria-label={item}
                              className="hover:underline"
                            >
                              <Typography variant="caption">{t(item)}</Typography>
                            </Link>
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                      </React.Fragment>
                    ))}
                    {routesName.length > 0 && (
                      <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>
                            <Typography variant="caption">
                              {t(
                                decodeURIComponent(
                                  routesName[routesName.length - 1] || ""
                                )
                              )}
                            </Typography>
                          </BreadcrumbPage>
                        </BreadcrumbItem>
                      </>
                    )}
                  </BreadcrumbList>
                </Breadcrumb> */}
              </div>
              <div className="flex items-center space-x-2 pr-3">
                <ThemeToggle />
              </div>
            </header>
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

              <ToolBar title={getRouteName()} />

              <div className="h-full  max-w-[1500px">{children}</div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  );
}
