
import { BadgeIcon } from "@/components/ui/custom/badge-icon";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { XIcon } from "lucide-react";

export default function ChatSideBar({items,onOpenChange}:{
    items:any[]
    onOpenChange:(e:boolean)=>void
}){
    return (
        <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-3">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    className=" rounded-full"
                    variant={"outline"}
                    onClick={() => {
                      onOpenChange(false);
                    }}
                  >
                    <XIcon />
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                    //   size={"lg"}
                        tooltip={item.title}
                        onClick={item.onClick}
                      >
                        <BadgeIcon
                                size={19}
                                icon={<item.icon/>}
                                count={item.count}
                        />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    )
}