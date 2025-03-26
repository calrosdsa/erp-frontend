import IconButton from "@/components/custom-ui/icon-button";
import { Autocomplete } from "@/components/custom/select/autocomplete-select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ArrowLeftIcon, EditIcon } from "lucide-react";
import { useEffect } from "react";
import { action, ChatSection } from "~/routes/home.chat/route";
import SearchBar from "~/routes/home/components/search-bar";
import { route } from "~/util/route";
import { useChatStore } from "../use-chat-store";

export default function ChatsSection() {
  const fetcher = useFetcher<typeof action>();
  const [searchParams, setSearchParams] = useSearchParams();
  const chatID = searchParams.get("chat_id");
  const {
    payload: { chats },
    setPayload,
  } = useChatStore();
  useEffect(() => {
    if (fetcher.data?.chats) {
      console.log("SET CHATS", fetcher.data.chats);
      setPayload({
        chats: fetcher.data.chats,
      });
    }
  }, [fetcher.data?.chats]);
  const fetchData = () => {
    fetcher.submit(
      {
        action: "chat",
      },
      {
        method: "POST",
        action: route.toRoute({ main: route.chat }),
        encType: "application/json",
      }
    );
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="w-full">
      <div className=" border-b p-2 w-full flex space-x-4 items-center">
        
        <Autocomplete
          className=" w-full"
          onValueChange={() => {}}
          data={[]}
          // isLoading={fetcher.state == "submitting"}
          nameK={"name"}
          placeholder="Buscar"
          isSearch={true}
        />
        <IconButton icon={EditIcon} />
      </div>
      {chats?.map((item) => {
        return (
          <div
            key={item.id}
            onClick={() => {
              searchParams.set("chat_id", item.id.toString());
              searchParams.set("chat_section", ChatSection.CHATS);
              setSearchParams(searchParams, {
                preventScrollReset: true,
              });
            }}
            className={cn(
              " flex  space-x-2 p-2 xl:p-4 w-full hover:bg-muted cursor-pointer",
              chatID == item.id.toString() && " bg-muted"
            )}
          >
            <Avatar className="w-12 h-12">
              {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
              {item.name && (
                <AvatarFallback className=" bg-primary text-primary-foreground">
                  {item.name[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col w-full">
              <div className="flex flex-col">
                <div className="flex justify-between">
                  <span className=" font-semibold">{item.name}</span>
                  <span className="text-xs">
                    {item.last_message_created_at &&
                      format(item.last_message_created_at, "d MMM, HH:mm:ss", {
                        locale: es,
                      })}
                  </span>
                </div>
                <div className="flex space-x-1 items-center justify-between">
                  <p className=" text-xs line-clamp-1">
                    {item.last_message_content}
                  </p>

                  {item.unread_count > 0 && (
                    <span
                      className="bg-primary p-1 text-primary-foreground rounded-full text-sm 
                w-5 h-5 flex items-center justify-center font-semibold
                "
                    >
                      {item.unread_count > 99
                        ? `${99}+`
                        : item.unread_count.toString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
