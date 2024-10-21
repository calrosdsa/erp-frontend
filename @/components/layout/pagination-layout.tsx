import { ReactNode } from "react";
import { useMediaQuery } from "usehooks-ts";
import { NavItem } from "~/types";
import ResponsiveSidebar from "./nav/responsive-sidebar";
import { Separator } from "../ui/separator";
import { components } from "~/sdk";
import ActivityFeed from "../custom-ui/activity-feed";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
import { useSearchParams } from "@remix-run/react";
import { DEFAULT_ORDER } from "~/constant";
import { useTranslation } from "react-i18next";

export default function PaginationLayout({
  children,filterOptions,orderOptions
}: {
    children: ReactNode;
    filterOptions:()=>JSX.Element;
    orderOptions:SelectItem[]
    }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [searchParams,setSearchParams] = useSearchParams()
  const {t} = useTranslation("common")
  return (
    // <div className={`h-full   ${!isDesktop ? "flex flex-col" : "flex"}`}>
    <div className={`h-full flex flex-col`}>
        <div className="grid gap-3 xl:flex xl:justify-between">
        {filterOptions()}
        <DropdownMenu>
                <div className="flex items-center">
                <Button variant={"outline"} className=" rounded-r-none" size={"sm"}
                onClick={(e)=>{
                    e.stopPropagation()
                    const order =  searchParams.get("order")
                    if(order == DEFAULT_ORDER){
                        searchParams.set("order","asc")
                    }else{
                        searchParams.set("order",DEFAULT_ORDER)
                    }
                    setSearchParams(searchParams,{
                        preventScrollReset:true
                    })
                }}>
                    {searchParams.get("order") == DEFAULT_ORDER ?
                    <ArrowDownWideNarrow size={13}/>
                    :
                    <ArrowUpWideNarrow size={13}/>
                    }
                </Button>
            <DropdownMenuTrigger>
                <Button  variant={"outline"} size={"sm"} className=" rounded-l-none">
                    {searchParams.get("columnName") || orderOptions[0]?.name || ""}
                </Button>
                    </DropdownMenuTrigger>
                </div>
                <DropdownMenuContent>
                    {orderOptions.map((item,idx)=>{
                        return (
                            <DropdownMenuItem key={idx} onClick={()=>{
                                searchParams.set("column",item.value)
                                searchParams.set("columnName",item.name)
                                setSearchParams(searchParams,{
                                    preventScrollReset:true
                                })
                            }}>
                                {item.name}
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuContent>
        </DropdownMenu>
        </div>
        <div className="px-1 sm:px-2 py-2 w-full">{children}</div>
    </div>
  );
}
