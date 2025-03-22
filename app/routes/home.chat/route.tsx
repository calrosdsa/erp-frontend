import { ActionFunctionArgs, json } from "@remix-run/node";
import apiClient from "~/apiclient";
import { components, operations } from "~/sdk";

export enum ChatSection {
  NOTIFICATIONS = "notifications",
  CHATS = "chats",
}
type ActionData = {
  action: string;
  notificationQuery: operations["notification"]["parameters"]["query"];
  chatID: string;
  chatQuery:operations["chat"]["parameters"]["query"];
  chatMessage:components["schemas"]["ChatMessageData"];
  messageQuery:operations["message"]["parameters"]["query"]
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const data = (await request.json()) as ActionData;
  const client = apiClient({ request });
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let notifications: components["schemas"]["NotificationDto"][] = [];
  let chatDetail: components["schemas"]["ChatDetailDto"] | undefined =
    undefined;
  let chats: components["schemas"]["ChatDto"][] = [];
  let chatMessages:components["schemas"]["ChatMessageDto"][] = []
  let chatMessage:components["schemas"]["ChatMessageDto"] | undefined = undefined
  switch (data.action) {
    case "message":{
      console.log("MESSAGE QUERY",data.messageQuery)
      const res =await client.GET("/chat/message",{
        params:{
          query:data.messageQuery,
        }
      })
      chatMessages = res.data?.result || []
      break;
    } 
    case "create-message":{
      const res =await client.POST("/chat/message",{
        body:data.chatMessage
      })
      error = res.error?.detail
      chatMessage = res.data?.result
      console.log(res.data,res.error?.detail)
      break;
    }
    case "chat-detail": {
      const res = await client.GET("/chat/detail/{id}", {
        params: {
          path: {
            id: data.chatID,
          },
        },
      });
      chatDetail = res.data?.result;
      console.log(res.data,res.error)
      break;
    }
    case "chat": {
      const res = await client.GET("/chat",{
        params:{
          query:data.chatQuery
        }
      });
      chats = res.data?.result || [];
      break;
    }
    case "notification": {
      const res = await client.GET("/notification", {
        params: {
          query: data.notificationQuery,
        },
      });
      notifications = res.data?.result || [];
      console.log("NOTIFICATIONS", notifications, res.error?.detail);
      break;
    }
  }
  return json({
    message,
    error,
    notifications,
    chatDetail,
    chats,
    chatMessage,
    chatMessages,
  });
};
