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
    <div className={`h-full   ${!isDesktop ? "flex flex-col" : "flex"}`}>
      <ResponsiveSidebar navItems={navItems} />
      <Separator orientation="vertical" className="h-auto" />

      <div className="px-2 py-2 w-full">{children}</div>
    </div>
  );
}
