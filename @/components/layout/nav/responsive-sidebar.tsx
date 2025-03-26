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
        "flex space-x-2 border w-full rounded-xl px-4 py-1",
        // `${!isDesktop && "flex"}`,
        // "min-w-44 flex-grow h-full "
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
              "p-2 font-medium text-sm ",
              path.includes(item.href) && " border-b-2 border-primary hover:border-primary",
              location.search != "" && item.href.includes(location.search) && " border-b-2 border-primary hover:border-primary"
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
