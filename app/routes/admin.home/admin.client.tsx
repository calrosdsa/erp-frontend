import AdminSidebar from "@/components/layout/admin-sidebar";
import FallBack from "@/components/layout/Fallback";
import HeaderAdmin from "@/components/layout/header-admin";
import ToolBar from "@/components/layout/toolbar/Toolbar";
import { Typography } from "@/components/typography";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link, useLocation } from "@remix-run/react";
import { HomeIcon, Sidebar } from "lucide-react";
import React, { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { ClientOnly } from "remix-utils/client-only";
import { useUnmount } from "usehooks-ts";
import { useToolbar } from "~/util/hooks/ui/use-toolbar";

export default function AdminClient({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { t } = useTranslation("common");

  const [routesName, setRoutesName] = React.useState<string[]>([]);

  const toolbar = useToolbar();

  const getRoutes = () => {
    const routesName = location.pathname.split("/").map((word) => t(word));
    console.log(routesName)
    setRoutesName(routesName.slice(3));
  };

  const getRoute = (index: number) => {
    const route = location.pathname
      .split("/")
      .slice(0, index + 4)
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
  return (
    <>
    <HeaderAdmin/>
      <div className="flex h-screen border-collapse overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 bg-secondary/10 pb-1">
          <div
            className="
    px-2 
    md:px-6 
    pt-4
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
            <div className="flex align-center">
              <Breadcrumb aria-label="breadcrumbs">
                <BreadcrumbList>
                  <BreadcrumbItem key="home">
                    <BreadcrumbLink asChild>
                      <Link
                        to="/admin/home"
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
                            <Typography variant="caption">{item}</Typography>
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
              </Breadcrumb>
            </div>

            <ToolBar title={getRouteName()} />

            <div className="h-full">{children}</div>
          </div>
        </main>
      </div>
    </>
  );
}
