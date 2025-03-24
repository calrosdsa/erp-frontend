import { format } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { components } from "~/sdk";

type MessageProps = {
  message: components["schemas"]["ChatMessageDto"];
  isCurrentUser: boolean;
  openModal: (key: string, value: string) => void;
};

export default function Message({
  message,
  isCurrentUser,
  openModal,
}: MessageProps) {
  const fullName = `${message.profile_fn} ${message.profile_gn}`.trim();
  const initials = `${message.profile_fn.charAt(0)}${message.profile_gn.charAt(
    0
  )}`.toUpperCase();

  const formattedTime = message.created_at
    ? format(new Date(message.created_at), "h:mm a")
    : "";

  return (
    <div
      className={`flex items-start gap-2 ${
        isCurrentUser ? "flex-row-reverse" : ""
      }`}
    >
      {!isCurrentUser && (
        <Avatar
          className="h-8 w-8 cursor-pointer"
          onClick={() => openModal("user_m", message.profile_id.toString())}
        >
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      )}

      <div
        className={`max-w-[80%] ${isCurrentUser ? "text-right" : "text-left"}`}
      >
        {!isCurrentUser && (
          <div
            className="text-sm font-medium mb-1 cursor-pointer"
            onClick={() => openModal("user_m", message.profile_id.toString())}
          >
            {fullName}
          </div>
        )}

        <Card
          className={`inline-block ${
            isCurrentUser ? "bg-primary text-primary-foreground" : ""
          }`}
        >
          <CardContent className="p-3">
            <p>{message.content}</p>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground mt-1">
          {formattedTime}
        </div>
      </div>
    </div>
  );
}
