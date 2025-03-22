import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";

import ChatSideBar from "./chat-sidebar";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { ChatSection } from "../route";
import NotificationSection from "../sections/notification-section";
import ChatsSection from "../sections/chats-section";
import ChatDetailSection from "../sections/chat-detail-section";
import { GlobalState } from "~/types/app-types";

// Menu items.
export default function ChatModal({ appContext }: { appContext: GlobalState }) {
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

            {chatSection == ChatSection.CHATS && (
              <ChatDetailSection appContext={appContext} />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
