import IconButton from "@/components/custom-ui/icon-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { ChevronDown, SendHorizonalIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { action } from "~/routes/home.chat/route";
import { components } from "~/sdk";
import { fullName } from "~/util/convertor/convertor";
import { route } from "~/util/route";
import MessageList from "../components/chat/message-list";

export default function ChatDetailSection() {
  const [searchParams, setSearchParams] = useSearchParams();
  const chatID = searchParams.get("chat_id");
  const fetcher = useFetcher<typeof action>();
  const chat = fetcher.data?.chatDetail;
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation("common");
  const message: components["schemas"]["ChatMemberDto"][] = [];
  const fetchData = () => {
    fetcher.submit(
      {
        action: "chat-detail",
        chatID: chatID,
      },
      {
        method: "POST",
        action: route.toRoute({ main: route.chat }),
        encType: "application/json",
      }
    );
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;

      // Show button when scrolled up more than 100px from bottom
      setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);

      // Load more messages when scrolled to top (with a small threshold)
      if (scrollTop < 50 && fetcher.state != "submitting") {
        //Load messages here
      }
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    console.log("REDER NOTIFICATION SECTION...");
    if (chatID) {
      fetchData();
    }
  }, [chatID]);
  return (
    <div className="w-full relative h-screen">
      <div className=" border-b p-2 w-full flex space-x-4 items-center">
        <Avatar className="w-12 h-12">
          {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
          {chat?.name && (
            <AvatarFallback className=" bg-primary text-primary-foreground">
              {chat?.name[0]}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col w-full">
          <div className="flex justify-between">
            <div className="flex justify-between">
              <span className=" font-semibold">{chat?.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-auto h-full pb-32"
        onScroll={handleScroll}
      >
        <MessageList
          messages={fetcher.data?.chatMessages || []}
          loading={fetcher.state == "submitting"}
        />
      </div>

      <div className=" absolute bottom-0 p-3 bg-muted w-full">
        <div className="flex space-x-3">
          <Input className="w-full" />
          <IconButton icon={SendHorizonalIcon} />
        </div>
      </div>

      {showScrollButton && (
        <IconButton
          icon={ChevronDown}
          onClick={scrollToBottom}
          className="absolute bottom-24 right-8 rounded-full w-10 h-10 p-0 shadow-md"
        />
        //   <ChevronDown className="h-5 w-5" />
        // </Button>
      )}
    </div>
  );
}
