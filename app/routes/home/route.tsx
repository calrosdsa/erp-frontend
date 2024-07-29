import { Box } from "@mui/joy";
import { Outlet } from "@remix-run/react";
import { useEffect, useState } from "react";
import FallBack from "~/components/layout/Fallback";
import HomeLayout from "./homeLayout";

let isHydrating = true;

export default function Home() {
  const [isHydrated, setIsHydrated] = useState(!isHydrating);

  useEffect(() => {
    isHydrating = false;
    setIsHydrated(true);
  }, []);

  if (isHydrated) {
    return (
      <div>
        <HomeLayout>
        <Outlet />
        </HomeLayout>
      </div>
    );
  } else {
    return <FallBack />;
  }
}
