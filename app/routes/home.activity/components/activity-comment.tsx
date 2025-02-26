import * as React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
}

export interface MentionState {
  id: string;
  username: string;
  indices: [number, number]; // [start, end] positions in text
}

// Sample user data
const users: User[] = [
  {
    id: "1",
    name: "Olivia Martin",
    username: "Olivia Martin",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Jackson Lee",
    username: "jackson",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Isabella Nguyen",
    username: "isabella",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "William Kim",
    username: "william",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Sofia Davis",
    username: "sofia",
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export default function MentionTextarea() {
  const [value, setValue] = React.useState("");
  const [mentions, setMentions] = React.useState<MentionState[]>([]);
  const [isCommandOpen, setIsCommandOpen] = React.useState(false);
  const [mentionQuery, setMentionQuery] = React.useState("");
  const [cursorPosition, setCursorPosition] = React.useState(0);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const commandRef = React.useRef<HTMLDivElement>(null);


  // Filter users based on mention query
  const filteredUsers = React.useMemo(() => {
    if (!mentionQuery) return users;
    const query = mentionQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.username.toLowerCase().includes(query)
    );
  }, [mentionQuery]);

  // Handle textarea value change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const newPosition = e.target.selectionStart;
    setValue(newValue);
    setCursorPosition(newPosition);

    // Check if we're in a mention context
    // const textBeforeCursor = newValue.substring(0, newPosition);
    // console.log(newValue[newPosition-1])
    // const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    // const contextMention = mentions.filter((mention) => {
    //   const mentionText = newValue.substring(
    //     mention.indices[0],
    //     mention.indices[1]
    //   );
    //   return mentionText === `@${mention.username}`;
    // });

    if (newValue[newPosition - 1] == "@") {
      setIsCommandOpen(true);
      //   setMentionQuery(mentionMatch[1] || "");
    } else {
      setIsCommandOpen(false);
      setMentionQuery("");
    }

    // Update mentions state when text is deleted
    const updatedMentions = mentions.filter((mention) => {
      const mentionText = newValue.substring(
        mention.indices[0],
        mention.indices[1]
      );
      return mentionText === `@${mention.username}`;
    });
    setMentions(updatedMentions);
  };

  // Handle user selection from command menu
  const handleSelect = (user: User) => {
    if (!textareaRef.current) return;

    const beforeCursor = value.substring(0, cursorPosition);
    const afterCursor = value.substring(cursorPosition);
    const lastAtSymbol = beforeCursor.lastIndexOf("@");

    if (lastAtSymbol !== -1) {
      const newBeforeCursor = beforeCursor.substring(0, lastAtSymbol);
      const mention = `@${user.username}`;
      const newValue = `${newBeforeCursor}${mention}${afterCursor}`;
      const newPosition = lastAtSymbol + mention.length + 1;

      setValue(newValue + " ");
      setMentions((prev) => [
        ...prev,
        {
          id: user.id,
          username: user.username,
          indices: [lastAtSymbol, lastAtSymbol + mention.length],
        },
      ]);

      // Update cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newPosition, newPosition);
          setCursorPosition(newPosition + 1);
        }
      }, 0);
    }

    setIsCommandOpen(false);
    setMentionQuery("");
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isCommandOpen && e.key === "Escape") {
      e.preventDefault();
      setIsCommandOpen(false);
    }
  };

  // Create a styled version of the textarea content
  const renderStyledContent = () => {
    if (!value) return null;

    const result = [];
    let lastIndex = 0;

    // Sort mentions by start index to process them in order
    const sortedMentions = [...mentions].sort(
      (a, b) => a.indices[0] - b.indices[0]
    );

    for (const mention of sortedMentions) {
      // Add text before mention
      if (mention.indices[0] > lastIndex) {
        result.push(value.substring(lastIndex, mention.indices[0]));
      }

      // Add styled mention
      const mentionText = value.substring(
        mention.indices[0],
        mention.indices[1]
      );
      result.push(
        <span
          key={mention.id + mention.indices[0]}
          className="text-blue-500 "
        >
          {mentionText}
        </span>
      );

      lastIndex = mention.indices[1];
    }

    // Add remaining text
    if (lastIndex < value.length) {
      result.push(value.substring(lastIndex));
    }

    return result;
  };

  return (
    <div className="relative space-y-2">
      <div className="relative">
        {/* Hidden styled content */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none px-3 py-2 text-sm break-words whitespace-pre-wrap 
         "
        >
          {renderStyledContent()}
        </div>

        {/* Actual textarea */}
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type @ to mention someone..."
          className="min-h-[150px] resize-none text-sm  caret-black text-transparent text
            selection:text-transparent"
        />
      </div>

      {/* Command menu for mentions */}
      {isCommandOpen && (
        <div className="absolute z-50 w-64 mt-1">
          <Command ref={commandRef} className="rounded-lg border shadow-md">
            <CommandInput
              placeholder="Search people..."
              value={mentionQuery}
              autoFocus
              onValueChange={setMentionQuery}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setMentionQuery("");
                  setIsCommandOpen(false);
                  textareaRef.current?.focus();
                }
              }}
            />
            <CommandList>
              <CommandEmpty>No users found</CommandEmpty>
              <CommandGroup heading="Suggestions">
                {filteredUsers.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => handleSelect(user)}
                    className="flex items-center gap-2"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        @{user.username}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
      {value}
      {/* Debug information */}
      {/* {mentions.length > 0 && (
        <div className="mt-4 p-3 text-sm rounded-md bg-muted">
          <h3 className="font-medium mb-2">Mentioned Users:</h3>
          <ul className="space-y-1">
            {mentions.map((mention, index) => (
              <li key={mention.id + index}>
                @{mention.username} (positions: {mention.indices.join("-")})
              </li>
            ))}
          </ul>
        </div>
      )} */}
    </div>
  );
}
