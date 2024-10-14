import { ReactNode } from "react";
import { useMediaQuery } from "usehooks-ts";
import { NavItem } from "~/types";
import ResponsiveSidebar from "./nav/responsive-sidebar";
import { Separator } from "../ui/separator";

export default function DetailLayout({
  children,
  navItems,
}: {
  children: ReactNode;
  navItems: NavItem[];
}) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    // <div className={`h-full   ${!isDesktop ? "flex flex-col" : "flex"}`}>
    <div className={`h-full flex flex-col border rounded-xl p-2`}>
      <ResponsiveSidebar navItems={navItems} />
      <Separator/>

      <div className="px-1 sm:px-2 py-2 w-full">{children}</div>
    </div>
  );
}
