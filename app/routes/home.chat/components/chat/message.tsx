import { format } from "date-fns"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { components } from "~/sdk"

type MessageProps = {
  message: components["schemas"]["ChatMessageDto"]
}

export default function Message({ message }: MessageProps) {
  const isCurrentUser = message.profile_id === 1 // Replace with actual current user check
  const fullName = `${message.profile_fn} ${message.profile_gn}`.trim()
  const initials = `${message.profile_fn.charAt(0)}${message.profile_gn.charAt(0)}`.toUpperCase()

  const formattedTime = message.created_at ? format(new Date(message.created_at), "h:mm a") : ""

  return (
    <div className={`flex items-start gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
      <Avatar className="h-8 w-8">
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <div className={`max-w-[80%] ${isCurrentUser ? "text-right" : "text-left"}`}>
        <div className="text-sm font-medium mb-1">{fullName}</div>

        <Card className={`inline-block ${isCurrentUser ? "bg-primary text-primary-foreground" : ""}`}>
          <CardContent className="p-3">
            <p>{message.content}</p>
          </CardContent>
        </Card>

        <div className="text-xs text-muted-foreground mt-1">{formattedTime}</div>
      </div>
    </div>
  )
}

