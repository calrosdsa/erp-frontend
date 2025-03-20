import { useEffect, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { toast } from "sonner";
import { create } from "zustand";
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
  const { addNotificationCount } = useWsStore();
  useEffect(() => {
    if (lastMessage !== null) {
      addNotificationCount();
      toast(lastMessage.data);
      console.log("LASTMESSAGE", lastMessage);
    }
  }, [lastMessage]);
  return readyState;
};

type Payload = {
  notifications: number;
};

interface WsStore {
  payload: Partial<Payload>;
  setPayload: (p: Partial<Payload>) => void;
  addNotificationCount: () => void;
}

export const useWsStore = create<WsStore>((set) => ({
  payload: {},
  addNotificationCount: () =>
    set((state) => ({
      payload: {
        ...state.payload,
        notifications: (state.payload?.notifications || 0) + 1,
      },
    })),
  setPayload: (e) =>
    set({
      payload: e,
    }),
}));
