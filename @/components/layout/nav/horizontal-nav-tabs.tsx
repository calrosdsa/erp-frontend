import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@remix-run/react";
import { NavItem } from "~/types"



export default function HorizontalNavTabs({navItems}:{
    navItems:NavItem[]
}){
    const location = useLocation();
    const path = location.pathname;
    return (
        <div className={cn("flex space-x-3")}>
          {navItems.map((item) => {
            return (
              <Link
                key={item.title}
                to={item.href}
                
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
    )
}