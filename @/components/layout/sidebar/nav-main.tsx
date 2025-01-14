import {BoxIcon, CalendarIcon, ChevronRight, ContactIcon, CreditCardIcon, CurrencyIcon, DollarSignIcon, MoveLeftIcon, MoveRightIcon, UsersIcon, WalletIcon, type LucideIcon } from "lucide-react";

import {
  Collapsible,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavItem } from "~/types";
import { Link } from "@remix-run/react";
import { components } from "~/sdk";
import { useCallback } from "react";
import icons from "~/data/icons";
export function NavMain({ items }: { items: components["schemas"]["ModuleDto"][] }) {
  const renderIcon = useCallback((iconType: string | null): JSX.Element => {
    // const d = <ContactIcon/>
    const f = icons.find((t) => t.value == iconType);
    if (f) {
      return <f.icon />;
    }
    return <BoxIcon />;
  }, []);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible key={item.label} asChild>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.label}>
                <Link to={item.href}>
                  {/* {item.icon && <item.icon />} */}
                  {renderIcon(item.icon_code)}
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
              {/* {item.children?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link to={subItem.href}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null} */}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
