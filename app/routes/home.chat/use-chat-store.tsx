import { create } from "zustand";
import { components } from "~/sdk";

type Payload = {
  notifications: number;
  chats: components["schemas"]["ChatDto"][];
  currentChat: components["schemas"]["ChatDetailDto"];
  lastMessage: components["schemas"]["ChatMessageDto"];
};

interface ChatStore {
  payload: Partial<Payload>;
  setPayload: (p: Partial<Payload>) => void;
  addNotificationCount: () => void;
  loadChat: (chat: components["schemas"]["ChatDetailDto"]) => void;
  handleLastMessage: (
    lastMessage: components["schemas"]["ChatMessageDto"]
  ) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  payload: {},
  loadChat: (chat) =>
    set((state) => {
      const updateChats = state.payload.chats?.map((item) => {
        if (item.id == chat.id) {
          item.unread_count = 0;
        }
        return item;
      });
      return {
        ...state,
        payload: {
          ...state.payload,
          currentChat: chat,
          chats: updateChats,
        },
      };
    }),
  handleLastMessage: (lastMessage) =>
    set((state) => {
      const updateChats = state.payload.chats?.map((chat) => {
        if (chat.id == lastMessage.chat_id) {
          chat.last_message_content = lastMessage.content;
          chat.last_message_created_at = lastMessage.created_at;
          chat.last_message_type = lastMessage.type;
          if (state.payload.currentChat?.id != lastMessage.chat_id) {
            chat.unread_count = chat.unread_count + 1;
          }
        }
        return chat;
      });
      return {
        ...state,
        payload: {
          ...state.payload,
          chats: updateChats,
          lastMessage: state.payload.currentChat ? lastMessage : undefined,
        },
      };
    }),
  addNotificationCount: () =>
    set((state) => ({
      payload: {
        ...state.payload,
        notifications: (state.payload?.notifications || 0) + 1,
      },
    })),
  setPayload: (e) =>
    set((state) => ({
      payload: {
        ...state.payload,
        ...e,
      },
    })),
}));
