
import { useMemo } from "react"
import { format } from "date-fns"
import DateSeparator from "./date-separator"
import { Loader2 } from "lucide-react"
import Message from "./message"
import { components } from "~/sdk"



type MessageListProps = {
  messages: components["schemas"]["ChatMessageDto"][]
  loading: boolean
}

export default function MessageList({ messages, loading }: MessageListProps) {
  // Group messages by date
  const groupedMessages = useMemo(() => {
    const groups: Record<string, components["schemas"]["ChatMessageDto"][]> = {}

    messages.forEach((message) => {
      const date = message.created_at ? format(new Date(message.created_at), "yyyy-MM-dd") : "Unknown"

      if (!groups[date]) {
        groups[date] = []
      }

      groups[date].push(message)
    })

    return Object.entries(groups).map(([date, msgs]) => ({
      date,
      messages: msgs,
    }))
  }, [messages])

  return (
    <div className="space-y-6">
      {loading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {groupedMessages.map((group) => (
        <div key={group.date} className="space-y-4">
          <DateSeparator date={group.date} />

          <div className="space-y-3">
            {group.messages.map((message) => (
              <Message key={message.id} message={message} />
            ))}
          </div>
        </div>
      ))}

      {messages.length === 0 && !loading && (
        <div className="text-center py-8 text-muted-foreground">No messages yet</div>
      )}
    </div>
  )
}

