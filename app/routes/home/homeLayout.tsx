import * as React from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Typography from "@mui/joy/Typography";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import Header from "~/components/layout/Header";
import Sidebar from "~/components/shared/sidebar/sidebar";
import OrderTable from "~/components/shared/table/CustomTable";
import { Link, useLocation } from "@remix-run/react";
import { useTranslation } from "react-i18next";

type RouteItem = {
  name: string;
  link: string;
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const { t } = useTranslation();

  const [routesName, setRoutesName] = React.useState<string[]>([]);

  const getRoutes = () => {
    const routesName = location.pathname
      .split("/")
      .map((word) => t(word).charAt(0).toUpperCase() + word.slice(1));
    setRoutesName(routesName.slice(2));
  };

  const getRoute = (index: number) => {
    const route = location.pathname
      .split("/")
      .slice(0, index + 3)
      .join("/");
    console.log(route);
    return route;
  };

  const getRouteName = () =>{
    const path =  location.pathname.split('/')
    return t(path.slice(-1))
  }

  React.useEffect(() => {
    getRoutes();
  }, [location.pathname]);
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Header />
        <Sidebar />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: "calc(12px + var(--Header-height))",
              sm: "calc(12px + var(--Header-height))",
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon fontSize="small" />}
              sx={{ pl: 0 }}
            >
              <Link
                color="neutral"
                to="/home"
                className="hover:underline"
                aria-label="Home"
              >
                <HomeRoundedIcon />
              </Link>
              {routesName.slice(0, routesName.length - 1).map((item, idx) => {
                return (
                  <Link
                    key={item}
                    color="neutral"
                    to={getRoute(idx)}
                    aria-label={item}
                    className="hover:underline"
                  >
                    <Typography fontWeight={500} fontSize={12}>
                      {item}
                    </Typography>
                  </Link>
                );
              })}

              <Typography color="primary" fontWeight={500} fontSize={12}>
                {routesName[routesName.length - 1]}
              </Typography>
            </Breadcrumbs>
          </Box>

          <Box
            sx={{
              display: "flex",
              mb: 1,
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "start", sm: "center" },
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Typography level="h2" component="h1">
              {getRouteName()}
              {/* {t("company.companies")} */}
            </Typography>
            <Button
              color="primary"
              startDecorator={<DownloadRoundedIcon />}
              size="sm"
            >
              Download PDF
            </Button>
          </Box>

          {children}
          {/* <OrderTable /> */}

          {/* <OrderTable />
            <OrderList /> */}
        </Box>
      </Box>
    </CssVarsProvider>
  );
}
