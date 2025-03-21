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
import { useFetcher, useSearchParams } from "@remix-run/react";
import { ChatSection } from "../route";
import NotificationSection from "../sections/notification-section";
import { route } from "~/util/route";
import { useEffect } from "react";
import { operations } from "~/sdk";
import { action } from "~/routes/home.chat/route";
import ChatsSection from "../sections/chats-section";
import ChatDetailSection from "../sections/chat-detail-section";

// Menu items.
export default function ChatModal() {
  // const { open, onOpenChange } = useChatStore();
  // const { payload } = useWsStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const chat = searchParams.get("chat_modal");
  const chatSection = searchParams.get("chat_section");
  const closeModal = () => {
    searchParams.delete("chat_modal");
    searchParams.delete("chat_section");
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };
  return (
    <Sheet open={chat == "1"} onOpenChange={(e) => closeModal()}>
      <SheetContent className="w-full md:max-w-full h-screen flex p-0 [&>button]:hidden gap-0">
        <ChatSideBar closeModal={closeModal} />

        <div className="grid grid-cols-4 w-full">
          <ChatsSection />
          <div className=" col-span-3 border-l">
            {chatSection == ChatSection.NOTIFICATIONS && (
              <NotificationSection />
            )}

            {chatSection == ChatSection.CHATS && <ChatDetailSection />}
          </div>
        </div>
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
