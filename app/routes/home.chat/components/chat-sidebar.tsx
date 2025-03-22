
import { Button } from "@/components/ui/button";
import { BadgeIcon } from "@/components/ui/custom/badge-icon";
import { useSearchParams } from "@remix-run/react";
import { BellIcon, MessagesSquareIcon, XIcon } from "lucide-react";
import { ChatSection } from "../route";
import { cn } from "@/lib/utils";
import { useChatStore } from "../use-chat-store";

export default function ChatSideBar({closeModal}:{
    closeModal:()=>void
}){
    const { payload } = useChatStore();
    const [searchParams,setSearchParams] = useSearchParams()
    const chatSection = searchParams.get("chat_section")
    const changeSection = (section:ChatSection) =>{
      searchParams.set("chat_section",section)
          setSearchParams(searchParams,{
            preventScrollReset:true
          })
    }
    const items = [
      {
        title: "Chats",
        icon: MessagesSquareIcon,
        count: 0,
        section:ChatSection.CHATS,
      },
      {
        title: "Notificaciones",
        icon: BellIcon,
        count: payload.notifications,
        section:ChatSection.NOTIFICATIONS,
      },
    ];
    return (
       <div className="w-[70px] border-r h-full bg-primary/80">
        <div className=" flex flex-col items-center">
        <Button variant={"outline"} onClick={()=>closeModal()} 
        className="bg-primary/30 rounded-full w-10 h-10 my-2">
          <XIcon className="text-muted-foreground"/>
        </Button>

        {items.map((item,idx)=>{
          return (
            <div 
            onClick={()=>changeSection(item.section)}
             className={cn(`w-full flex flex-col items-center p-2 text-primary-foreground/60 item
              hover:text-primary-foreground cursor-pointer hover:bg-primary/50`,
              chatSection == item.section && "text-primary-foreground bg-primary/50",
              )} key={idx}>
              <BadgeIcon
              icon={<item.icon className="w-5 h-5"/>}
              count={item.count}
              />
              <span className=" text-[10px]">{item.title}</span>
            </div>
          )
        })}
        
        </div>
       </div>
    )
}