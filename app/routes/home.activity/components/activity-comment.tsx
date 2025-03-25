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
import { useProfileFetcher } from "~/util/hooks/fetchers/profile/profile-fetcher";
import { components } from "~/sdk";
import {
  ActivityData,
  MentionData,
} from "~/util/data/schemas/core/activity-schema";
import { Action } from "~/types/enums";
import { UseFormReturn } from "react-hook-form";
import { Link } from "@remix-run/react";

export default function MentionTextarea({
  setMentions,
  setValue,
  value,
  mentions,
}: {
  setValue: React.Dispatch<React.SetStateAction<string>>;
  value: string;
  setMentions: React.Dispatch<React.SetStateAction<MentionData[]>>;
  mentions: MentionData[];
}) {
  // const value = form.getValues().activity_comment?.comment || "";
  // const mentions = form.getValues().activity_comment?.mentions || [];
  const [isCommandOpen, setIsCommandOpen] = React.useState(false);
  const [mentionQuery, setMentionQuery] = React.useState("");
  const [cursorPosition, setCursorPosition] = React.useState(0);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const commandRef = React.useRef<HTMLDivElement>(null);
  const [profileFetcher, onProfileChange] = useProfileFetcher();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const newPosition = e.target.selectionStart;
    setValue(newValue);
    // form.setValue("activity_comment.comment", newValue);
    setCursorPosition(newPosition);

    // Check if we're in a mention context
    // const textBeforeCursor = newValue.substring(0, newPosition);
    // console.log(newValue[newPosition-1])
    // const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    // const contextMention = mentions.filter((mention) => {
    //   const mentionText = newValue.substring(
    //     mention.start_index,
    //     mention.end_index
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
        mention.start_index,
        mention.end_index
      );
      return mentionText === `@${mention.full_name}`;
    });
    setMentions(updatedMentions);
    // form.setValue("activity_comment.mentions", updatedMentions);
    // form.trigger("activity_comment.mentions")
    // fr
  };

  // Handle user selection from command menu
  const handleSelect = (user: components["schemas"]["ProfileDto"]) => {
    if (!textareaRef.current) return;

    const beforeCursor = value.substring(0, cursorPosition);
    const afterCursor = value.substring(cursorPosition);
    const lastAtSymbol = beforeCursor.lastIndexOf("@");

    if (lastAtSymbol !== -1) {
      const newBeforeCursor = beforeCursor.substring(0, lastAtSymbol);
      const mention = `@${user.full_name}`;
      const newValue = `${newBeforeCursor}${mention}${afterCursor}`;
      const newPosition = lastAtSymbol + mention.length + 1;

      setValue(newValue + " ");
      setMentions((prev) => [
        ...prev,
        {
          action: Action.CREATE,
          profile_id: user.id,
          full_name: user.full_name,
          start_index: lastAtSymbol,
          end_index: lastAtSymbol + mention.length,
        },
      ]);

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
      (a, b) => a.start_index - b.start_index
    );

    for (const mention of sortedMentions) {
      // Add text before mention
      if (mention.start_index > lastIndex) {
        result.push(value.substring(lastIndex, mention.start_index));
      }

      // Add styled mention
      const mentionText = value.substring(
        mention.start_index,
        mention.end_index
      );
      result.push(
        <span key={mention.start_index} className="text-blue-500 ">
          {mentionText}
        </span>
      );

      lastIndex = mention.end_index;
    }

    // Add remaining text
    if (lastIndex < value.length) {
      result.push(value.substring(lastIndex));
    }

    return result;
  };

  React.useEffect(() => {
    if (mentionQuery) {
      onProfileChange(mentionQuery);
    }
  }, [mentionQuery]);

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
          autoFocus
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type @ to mention someone..."
          className="resize-none text-sm  caret-black text-transparent text
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
              onFocus={() => onProfileChange("")}
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
                {profileFetcher.data?.results.map((user) => (
                  <CommandItem
                    key={user.id}
                    onSelect={() => handleSelect(user)}
                    className="flex items-center gap-2"
                  >
                    <Avatar className="h-6 w-6">
                      {/* <AvatarImage src={user.ava tar} alt={user.name} /> */}
                      <AvatarFallback>
                        {user.given_name.charAt(0)}.{user.family_name.charAt(0)}
                        .
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.full_name}</div>
                      <div className="text-xs text-muted-foreground">
                        @{user.full_name}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
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

export const RenderMentionText = ({
  mentionText,
  mentions,
}: {
  mentionText: string;
  mentions: components["schemas"]["ActivityMentionDto"][];
}) => {
  // Sort mentions by start_index to process them in order
  const sortedMentions = [...mentions].sort(
    (a, b) => a.start_index - b.start_index
  );

  // Create an array of text segments and mentions
  const segments: JSX.Element[] = [];
  let lastIndex = 0;

  sortedMentions.forEach((mention, index) => {
    // Add text before the mention
    if (mention.start_index > lastIndex) {
      segments.push(
        <React.Fragment key={`text-${index}`}>
          {mentionText.substring(lastIndex, mention.start_index)}
        </React.Fragment>
      );
    }

    // Add the mention as a link
    segments.push(
      <Link
        key={`mention-${mention.id}`}
        to={`/profile/${mention.profile_uuid}`}
        className="bg-blue-100 text-blue-700 rounded px-1 hover:bg-blue-200 transition-colors"
      >
        {mention.given_name} {mention.family_name}
      </Link>
    );

    lastIndex = mention.end_index;
  });

  // Add any remaining text after the last mention
  if (lastIndex < mentionText.length) {
    segments.push(
      <React.Fragment key="text-end">{mentionText.substring(lastIndex)}</React.Fragment>
    );
  }

  return <div className="">{segments}</div>;
};
