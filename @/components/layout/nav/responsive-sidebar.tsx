import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { NavItem } from "~/types";
import { useSidebar } from "~/util/hooks/useSidebar";

export default function ResponsiveSidebar({
  navItems,
  className,
  setOpen,
}: {
  navItems: NavItem[];
  className?: string;
  setOpen?: (open: boolean) => void;
}) {
  const location = useLocation();
  const path = location.pathname;
  const { isOpen } = useSidebar();
  const [openItem, setOpenItem] = useState("");
  const [lastOpenItem, setLastOpenItem] = useState("");
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    if (isOpen) {
      setOpenItem(lastOpenItem);
    } else {
      setLastOpenItem(openItem);
      setOpenItem("");
    }
  }, [isOpen]);
  return (
    <div className={cn(
        `${!isDesktop && "flex"}`,
        "min-w-44 flex-grow h-full "
        )}>
      {navItems.map((item) => {
        return (
          <Link
            key={item.title}
            to={item.href}
            onClick={() => {
              if (setOpen) setOpen(false);
            }}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "group relative flex h-12 justify-start",
              item.href.includes(path) && "bg-muted font-bold hover:bg-muted"
            )}
          >
            {item.icon != undefined && (
              <item.icon className={cn("h-5 w-5", item.color)} />
            )}

              {item.title}
          </Link>
        );
      })}
    </div>
  );
}
