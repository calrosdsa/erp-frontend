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
import { useMediaQuery } from "usehooks-ts";

// Menu items.
export default function ChatModal({ appContext }: { appContext: GlobalState }) {
  // const { open, onOpenChange } = useChatStore();
  // const { payload } = useWsStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const chat = searchParams.get("chat_modal");
  const chatID = searchParams.get("chat_id");
  const isDesktop = useMediaQuery("(min-width: 1024px)");

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
      <SheetContent className="w-full sm:max-w-full h-screen flex p-0 [&>button]:hidden gap-0">
        <ChatSideBar closeModal={closeModal} />

        <div className="grid lg:grid-cols-4 w-full">
          <div className="hidden lg:block">
            <ChatsSection />
          </div>
          <div className="lg:col-span-3 border-l">
            {chatSection == ChatSection.NOTIFICATIONS && (
              <NotificationSection />
            )}

            {chatSection == ChatSection.CHATS && (
              <>
                {!isDesktop && !chatID ? (
                  <ChatsSection />
                ) : (
                  <ChatDetailSection appContext={appContext} />
                )}
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
