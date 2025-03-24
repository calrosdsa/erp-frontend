import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendHorizonalIcon, SendIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useFetcher } from "@remix-run/react";
import { action } from "../../route";
import { components } from "~/sdk";
import { ChatMessageType, chatMessageTypeToJSON } from "~/gen/common";
import { route } from "~/util/route";
import IconButton from "@/components/custom-ui/icon-button";

type MessageInputProps = {
  onSend: () => void;
  chatID?: number;
  profile?: components["schemas"]["ProfileDto"];
};

export default function MessageInput({
  onSend,
  chatID,
  profile,
}: MessageInputProps) {
  const [message, setMessage] = useState("");
  const fetcher = useFetcher<typeof action>();

  const handleSubmit = (e: React.FormEvent) => {
    if(!profile || !chatID) return
    e.preventDefault();
    if (message.trim()) {
      // Here you would typically send the message to your API
      console.log("Sending message:", message);
      setMessage("");
      const body: components["schemas"]["ChatMessageData"] = {
        profile_fn:profile.family_name,
        profile_gn:profile.given_name,
        fields: {
          content: message,
          type: chatMessageTypeToJSON(ChatMessageType.Base),
          profile_id: profile.id,
          chat_id: chatID,
        },
      };
      fetcher.submit(
        {
          action: "create-message",
          chatMessage: body,
        },
        {
          action: route.toRoute({
            main: route.chat,
          }),
          encType: "application/json",
          method: "POST",
        }
      );
      // onSend()
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className=" absolute bottom-0 p-3 bg-muted w-full px-4 xl:px-10 z-10">
      <fetcher.Form onSubmit={handleSubmit} className="flex items-end gap-2 w-full">
        <div className="flex space-x-3 w-full items-center">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full h-12"
          />
          <IconButton icon={SendHorizonalIcon} type="submit" />
        </div>
      </fetcher.Form>
    </div>
  );
}
