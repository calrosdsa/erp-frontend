import React, { useState } from "react";
import { SideNav } from "@/components/layout/side-nav";

import { cn } from "@/lib/utils";
import { BsArrowLeftShort } from "react-icons/bs";
import { useSidebar } from "~/util/hooks/useSidebar";
import { NavItems } from "../constant/side-nav";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app";
import { Button } from "../ui/button";
import { NavAdminItems } from "../constant/side-admin-nav";

interface SidebarProps {
  className?: string;
}

export default function AdminSidebar({ className }: SidebarProps) {
  const { isOpen, toggle } = useSidebar();
  const [status, setStatus] = useState(false);
  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };
  return (
    <nav
      className={cn(
        `relative hidden h-screen  overflow-auto border-r pt-20 md:block`,
        status && "duration-500",
        isOpen ? "w-64" : "w-[78px]",
        className
      )}
    >
      <div className="space-y-4 py-4">  
        <div className="px-3 py-2">
          <div className="mt-1 space-y-1">
            <SideNav
              className="text-background opacity-0 transition-all duration-300 group-hover:z-50 group-hover:ml-4 group-hover:rounded group-hover:bg-foreground group-hover:p-2
               group-hover:opacity-100 overflow-auto "
              items={NavAdminItems()}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}