import { useMemo } from "react";
import { format } from "date-fns";
import DateSeparator from "./date-separator";
import { Loader2 } from "lucide-react";
import Message from "./message";
import { components } from "~/sdk";

type MessageListProps = {
  messages: components["schemas"]["ChatMessageDto"][];
  loading: boolean;
  profile?:components["schemas"]["ProfileDto"];
  openModal:(key:string,value:string)=>void
};

export default function MessageList({ messages, loading,profile,openModal }: MessageListProps) {
  const groupedMessages = useMemo(() => {
    const groups: Record<string, components["schemas"]["ChatMessageDto"][]> = {};

    messages.forEach((message) => {
      const date = message.created_at 
        ? format(new Date(message.created_at), "yyyy-MM-dd",) 
        : "Unknown";

      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });

    return Object.entries(groups)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB)) // Sort groups by date
      .map(([date, msgs]) => ({
        date,
        messages: msgs.sort((a, b) => {
          // Sort messages chronologically
          const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return timeA - timeB;
        }),
      }));
  }, [messages]);

  return (
    <div className="space-y-6 px-2 xl:px-4">
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
              <Message key={message.id} message={message}
              isCurrentUser={profile?.id == message.profile_id}
              openModal={openModal}/>
            ))}
          </div>
        </div>
      ))}
      {!loading && messages.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">No messages yet</div>
      )}
    </div>
  );
}