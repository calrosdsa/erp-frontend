import * as React from "react";
import { Link, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app";
import { SessionDefaultDrawer } from "./components/SessionDefaults";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Typography, { headline, sm, title, xs } from "@/components/typography/Typography";
import { HomeIcon } from "lucide-react";
import GlobalDialogs from "./components/dialogs";
import ToolBar from "@/components/layout/toolbar/Toolbar";
import { useToolbar } from "~/util/hooks/ui/useToolbar";

type RouteItem = {
  name: string;
  link: string;
};

export default function HomeLayout({
  children,
  globalState,
}: {
  children: React.ReactNode;
  globalState: GlobalState;
}) {
  const location = useLocation();
  const { t } = useTranslation("common");
  const [openSessionDefaults, setOpenSessionDefaults] = React.useState(false);

  const [routesName, setRoutesName] = React.useState<string[]>([]);

  const toolbar = useToolbar()

  const getRoutes = () => {
    const routesName = location.pathname.split("/").map((word) => t(word));
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
    const route = path.slice(-1)[0]
    return t(decodeURIComponent(route||""));
  };

  React.useEffect(() => {
    getRoutes();
    // if(toolbar.isMounted){
    //   console.log("RESET TOOLBAR")
    //   toolbar.resetState()
    // }
  }, [location.pathname]);
  React.useEffect(() => {
    setOpenSessionDefaults(false);
  }, [location]);
  return (
    <>
      <GlobalDialogs  globalState={globalState}/>
      {openSessionDefaults && (
        <SessionDefaultDrawer
          open={openSessionDefaults}
          close={() => setOpenSessionDefaults(false)}
          session={globalState.session}
        />
      )}

      <Header
        data={globalState}
        openSessionDefaults={() => setOpenSessionDefaults(true)}
      />
      <div className="flex h-screen border-collapse overflow-hidden">
        <Sidebar data={globalState} />
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
                  <BreadcrumbItem>
                    <Link
                      color="neutral"
                      to="/home"
                      className="hover:underline"
                      aria-label="Home"
                    >
                      <HomeIcon size={15} />
                    </Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  {routesName
                    .slice(0, routesName.length - 1)
                    .map((item, idx) => {
                      return (
                        <>
                          <BreadcrumbItem key={item}>
                            <Link
                              key={item}
                              color="neutral"
                              to={getRoute(idx)}
                              aria-label={item}
                              className="hover:underline"
                            >
                              <Typography fontSize={xs}>{item}</Typography>
                            </Link>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator />
                        </>
                      );
                    })}

                  <Typography fontSize={xs}>
                    {decodeURIComponent(routesName[routesName.length - 1]||"")}
                  </Typography>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <ToolBar
            title={getRouteName()}/>

            <div className="h-full">
            {children}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

// <Box sx={{ display: "flex", minHeight: "100dvh" }}>
//         <Header />
//         <Sidebar
//         globalState={globalState}
//         openSessionDefaults={()=>setOpenSessionDefaults(true)}
//         />
//         <Box
//           component="main"
//           className="MainContent"
//           sx={{
//             px: { xs: 2, md: 6 },
//             pt: {
//               xs: "calc(12px + var(--Header-height))",
//               sm: "calc(12px + var(--Header-height))",
//               md: 3,
//             },
//             pb: { xs: 2, sm: 2, md: 3 },
//             flex: 1,
//             display: "flex",
//             flexDirection: "column",
//             minWidth: 0,
//             height: "100dvh",
//             gap: 1,
//           }}
//         >
// <Box sx={{ display: "flex", alignItems: "center" }}>
//   <Breadcrumbs
//     size="sm"
//     aria-label="breadcrumbs"
//     separator={<ChevronRightRoundedIcon fontSize="small" />}
//     sx={{ pl: 0 }}
//   >
//     <Link
//       color="neutral"
//       to="/home"
//       className="hover:underline"
//       aria-label="Home"
//     >
//       <HomeRoundedIcon />
//     </Link>
//     {routesName.slice(0, routesName.length - 1).map((item, idx) => {
//       return (
//         <Link
//           key={item}
//           color="neutral"
//           to={getRoute(idx)}
//           aria-label={item}
//           className="hover:underline"
//         >
//           <Typography fontWeight={500} fontSize={12}>
//             {item}
//           </Typography>
//         </Link>
//       );
//     })}

//     <Typography color="primary" fontWeight={500} fontSize={12}>
//       {routesName[routesName.length - 1]}
//     </Typography>
//   </Breadcrumbs>
// </Box>

// <Box
//   sx={{
//     display: "flex",
//     mb: 1,
//     gap: 1,
//     flexDirection: { xs: "column", sm: "row" },
//     alignItems: { xs: "start", sm: "center" },
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   }}
// >
//   <Typography level="h2" component="h1">
//     {getRouteName()}
//   </Typography>
// </Box>

//           {children}
//         </Box>
//       </Box>
