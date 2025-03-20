import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import SearchBar from "./search-bar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { BadgeIcon } from "@/components/ui/custom/badge-icon";
import { BellIcon } from "lucide-react";
import { useWsStore } from "../ws-handler";
import { Button } from "@/components/ui/button";
import { useChatStore } from "~/routes/home.chat/components/chat-modal";

export const Navbar = () => {
    const {payload} = useWsStore()
    const {onOpenChange} = useChatStore()
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 justify-between">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
       
      </div>
      <div className="flex items-center space-x-4 pr-3">
        <SearchBar />
        <ThemeToggle />
        
        <BadgeIcon
        size={36}
        icon={<BellIcon/>}
        count={payload.notifications}
        onClick={()=>{
            onOpenChange(true)
        }}
        />
      </div>
    </header>
  );
};
