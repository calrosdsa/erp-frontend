import { cn } from "@/lib/utils";
import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { Boxes, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { Form, Link } from "@remix-run/react";
import { GlobalState, UserData } from "~/types/app";
import { UserNav } from "./user-nav";

export default function Header({ data,openSessionDefaults }: { 
    data: GlobalState 
    openSessionDefaults:()=>void
}) {
  // const { data: sessionData } = useSession();
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-16 items-center justify-between px-4">
        <Link
          to={"/home"}
          className="hidden items-center justify-between gap-2 md:flex"
        >
          {(data.activeCompany && data.activeCompany.Logo != "") ?

          <img className="h-16 w-16 object-contain"
          src={data.activeCompany.Logo}
          />
          :
            <Boxes className="h-6 w-6" />
          }

          {data.activeCompany &&
          <h1 className="text-lg font-semibold">{data.activeCompany.Name}</h1>
          }
        </Link>
        <div className={cn("block md:!hidden")}>
          <MobileSidebar 
          data={data}
          />
        </div>

        <div className="flex items-center gap-2">
          {data.profile != undefined && <UserNav
           user={data.profile} 
           openSessionDefaults={openSessionDefaults}
           />}         
          <ThemeToggle />
          {/* <Button size="sm"
                            onClick={() => {
                            }}
                        >
                            Sign In dasdas
                        </Button> */}
          {/* {sessionData?.user ? (
                        <UserNav user={sessionData.user} /> 
                    ) : (
                        <Button size="sm"
                            onClick={() => {
                                void signIn();
                            }}
                        >
                            Sign In
                        </Button>
                    )} */}
        </div>
      </nav>
    </div>
  );
}
