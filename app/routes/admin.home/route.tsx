import FallBack from "@/components/layout/Fallback";
import { ClientOnly } from "remix-utils/client-only";
import AdminClient from "./admin.client";
import { Outlet } from "@remix-run/react";

export default function Admin() {
  return (
    <ClientOnly fallback={<FallBack />}>
      {() => {
        return (
          <AdminClient>
            <Outlet />
          </AdminClient>
        );
      }}
    </ClientOnly>
  );
}
