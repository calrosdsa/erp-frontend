import IconButton from "@/components/custom-ui/icon-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  useFetcher,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { ArrowLeftIcon, ChevronDown, SendHorizonalIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { action } from "~/routes/home.chat/route";
import { components, operations } from "~/sdk";
import { fullName } from "~/util/convertor/convertor";
import { route } from "~/util/route";
import MessageList from "../components/chat/message-list";
import MessageInput from "../components/chat/message-input";
import { GlobalState } from "~/types/app-types";
import { DEFAULT_SIZE } from "~/constant";
import { useChatStore } from "../use-chat-store";
import { useUnmount } from "usehooks-ts";
import { openUserModal } from "~/routes/home.manage.users.$id/route";
import { ChatType, chatTypeToJSON } from "~/gen/common";

export default function ChatDetailSection({
  appContext,
}: {
  appContext: GlobalState;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const chatID = searchParams.get("chat_id");
  const fetcher = useFetcher<typeof action>();
  const messageFetcher = useFetcher<typeof action>();
  const updateLastReadFetcher = useFetcher<typeof action>();
  const chat = fetcher.data?.chatDetail;
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const {
    payload: { lastMessage },
    setPayload,
    loadChat,
  } = useChatStore();
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [previousScrollHight, setPreviousScrollHeight] = useState(0);
  const [messages, setMessages] = useState<
    components["schemas"]["ChatMessageDto"][]
  >([]);

  const updateMemberLastRead = () => {
    updateLastReadFetcher.submit(
      {
        action: "update-member-last-read",
        chatID: chatID,
      },
      {
        action: route.toRoute({ main: route.chat }),
        encType: "application/json",
        method: "POST",
      }
    );
  };

  const fetchMessages = () => {
    console.log("FETCHING MESSAGES....");
    const body: operations["message"]["parameters"]["query"] = {
      size: DEFAULT_SIZE,
      page: page,
      id: chatID || "",
    };
    messageFetcher.submit(
      {
        action: "message",
        messageQuery: body,
      },
      {
        method: "POST",
        action: route.toRoute({ main: route.chat }),
        encType: "application/json",
      }
    );
  };
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
      setPreviousScrollHeight(scrollHeight);
      // Load more messages when scrolled to top (with a small threshold)
      if (scrollTop < 50 && hasMore && messageFetcher.state != "submitting") {
        console.log("HANDLE SCROLL...");
        fetchMessages();
        //Load messages here
      }
    }
  };
  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        chatContainerRef.current;
      chatContainerRef.current.scrollTop = scrollHeight - previousScrollHight;
      console.log(
        "CHAT CONTAINER CURRENT",
        chatContainerRef.current?.scrollHeight
      );
    }
  }, [page]);

  useEffect(() => {
    if (messageFetcher.data?.chatMessages) {
      const newMessages = messageFetcher.data.chatMessages;
      setMessages((prev) => {
        const updatedMessages = [...prev, ...newMessages];
        if (page === 0) {
          setTimeout(scrollToBottom, 0);
        }
        return updatedMessages;
      });
      setHasMore(newMessages.length >= Number(DEFAULT_SIZE));
      setPage((prev) => prev + 1);
    }
  }, [messageFetcher.data]);

  useEffect(() => {
    if (fetcher.data?.chatDetail) {
      loadChat(fetcher.data.chatDetail);
    }
  }, [fetcher.data]);

  useUnmount(() => {
    setPayload({
      currentChat: undefined,
    });
  });

  useEffect(() => {
    if (lastMessage) {
      updateMemberLastRead();
      setMessages((prev) => {
        setTimeout(scrollToBottom, 0);
        return [lastMessage, ...prev];
      });
    }
  }, [lastMessage]);

  const openModal = (key: string, value: string) => {
    searchParams.set(key, value);
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };

  useEffect(() => {
    console.log("REDER NOTIFICATION SECTION...");
    if (chatID) {
      fetchMessages();
      fetchData();
    }
  }, [chatID]);

  const navigateToChatParty = useCallback(() => {
    if (chat?.type == chatTypeToJSON(ChatType.Conversation)) {
      openUserModal(chat?.party_id.toString(), openModal);
    }
  }, [chat]);
  return (
    <div className="w-full relative h-screen">
      <div className=" border-b p-2 w-full flex space-x-4 items-center">
        <IconButton
          icon={ArrowLeftIcon}
          onClick={() => {
            searchParams.delete("chat_id");
            setSearchParams(searchParams, {
              preventScrollReset: true,
            });
          }}
          className="lg:hidden"
        />
        <Avatar
          className="w-12 h-12 cursor-pointer"
          onClick={navigateToChatParty}
        >
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
              <span
                className=" font-semibold cursor-pointer"
                onClick={navigateToChatParty}
              >
                {chat?.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={chatContainerRef}
        className="flex-1 overflow-auto h-full pb-36"
        onScroll={handleScroll}
      >
        <MessageList
          openModal={openModal}
          messages={messages}
          profile={appContext.profile}
          loading={messageFetcher.state == "submitting"}
        />
      </div>

      <MessageInput
        onSend={() => {}}
        chatID={chat?.id}
        profile={appContext.profile}
      />

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
