import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { create } from "zustand";
import {
  BellIcon,
  Calendar,
  Home,
  Inbox,
  MessagesSquareIcon,
  Search,
  Settings,
  XIcon,
} from "lucide-react";

import { SidebarProvider } from "@/components/ui/sidebar";
import { Collapsible } from "@radix-ui/react-collapsible";
import { BadgeIcon } from "@/components/ui/custom/badge-icon";
import { useWsStore } from "~/routes/home/ws-handler";
import ChatSideBar from "./chat-sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Menu items.
export default function ChatModal() {
  const { open, onOpenChange } = useChatStore();
  const { payload } = useWsStore();
  const items = [
    {
      title: "Chats",
      onClick: () => {},
      icon: MessagesSquareIcon,
      count: 0,
    },
    {
      title: "Notificaciones",
      onClick: () => {},
      icon: BellIcon,
      count: payload.notifications,
    },
  ];
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full md:max-w-full ">
        <SidebarProvider open={false}>
          {/* <ChatSideBar onOpenChange={onOpenChange} items={items} /> */}
          <Tabs defaultValue="account" className="w-[400px]" orientation="vertical">
            <TabsList className="grid">
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
              Make changes to your account here.
            </TabsContent>
            <TabsContent value="password">
              Change your password here.
            </TabsContent>
          </Tabs>

          <div className="grid grid-cols-5 w-full">
            <div className=" col-span-2">CONTENT 1</div>
            <div className=" col-span-3">Content 2 das</div>
          </div>
        </SidebarProvider>
      </SheetContent>
    </Sheet>
  );
}

type ChatStorePayload = {};

interface ChatStore {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  open: false,
  onOpenChange: (e) =>
    set({
      open: e,
    }),
}));
