import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { toast } from "sonner";
import { create } from "zustand";
import { MessageType, messageTypeFromJSON } from "~/gen/common";
import { components } from "~/sdk";
import { WsMessage } from "~/types/app-types";
import { useChatStore } from "../home.chat/use-chat-store";
import { useFetcher } from "@remix-run/react";
import { action } from "../home.notification/route";
import { route } from "~/util/route";
export const WsHandler = ({
  accessToken,
  sessionUUID,
}: {
  accessToken: string;
  sessionUUID: string;
}) => {
  const [socketUrl, setSocketUrl] = useState(
    `ws://localhost:9090/ws/subscribe?token=${accessToken}&session_uuid=${sessionUUID}`
  );
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);
  const { addNotificationCount, setPayload, handleLastMessage } =
    useChatStore();

  const notificationCountFetcher = useFetcher<typeof action>();

  const initData = () => {
    notificationCountFetcher.submit(
      {
        action: "notification-count",
      },
      {
        method: "POST",
        action: route.to(route.notification),
        encType: "application/json",
      }
    );
  };

  const parseMessage = (message: string) => {
    try {
      const m: WsMessage = JSON.parse(message);
      return m;
    } catch (err) {
      return undefined;
    }
  };

  const handleMessage = (lastMessage: any) => {
    try {
      const message = parseMessage(lastMessage.data);
      if (message == undefined) return;
      const messageType = messageTypeFromJSON(message?.type);
      switch (messageType) {
        case MessageType.ChatMessage:
          const chatMessage = JSON.parse(
            message?.message
          ) as components["schemas"]["ChatMessageDto"];
          handleLastMessage(chatMessage);
          break;
        case MessageType.Notification:
          toast(message?.message);
          addNotificationCount();
          break;
      }
      console.log("LASTMESSAGE", lastMessage);
    } catch (err) {}
  };

  useEffect(() => {
    if (lastMessage !== null) {
      handleMessage(lastMessage);
    }
  }, [lastMessage]);

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    if (notificationCountFetcher.data?.notificationCount) {
      setPayload({
        notifications: notificationCountFetcher.data.notificationCount,
      });
    }
  }, [notificationCountFetcher.data]);
  return readyState;
};

// type Payload = {
//   notifications: number;
//   lastMessage: components["schemas"]["ChatMessageDto"];
// };

// interface WsStore {
//   payload: Partial<Payload>;
//   setPayload: (p: Partial<Payload>) => void;
//   addNotificationCount: () => void;
// }

// export const useWsStore = create<WsStore>((set) => ({
//   payload: {},
//   addNotificationCount: () =>
//     set((state) => ({
//       payload: {
//         ...state.payload,
//         notifications: (state.payload?.notifications || 0) + 1,
//       },
//     })),
//   setPayload: (e) =>
//     set({
//       payload: e,
//     }),
// }));
