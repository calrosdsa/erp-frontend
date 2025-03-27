import { Button } from "@/components/ui/button";
import { SheetClose, SheetHeader } from "@/components/ui/sheet";
import { useSearchParams } from "@remix-run/react";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { route } from "~/util/route";
import { useFetcher } from "@remix-run/react";
import { loader } from "~/routes/home.user.$id/route";
import { LoadingSpinner } from "@/components/custom/loaders/loading-spinner";
import TabNavigation from "@/components/ui/custom/tab-navigation";
import ProfileInfo from "./tab/user-info";
import { fullName } from "~/util/convertor/convertor";
import ModalLayout from "@/components/ui/custom/modal-layout";
export default function UserModal() {
  const [searchParams, setSearchParams] = useSearchParams();
  const userID = searchParams.get(route.user);
  const tab = searchParams.get("tab") || "info";
  const [open, setOpen] = useState(true);
  const fetcher = useFetcher<typeof loader>();
  const data = fetcher.data;

  const initData = () => {
    fetcher.submit(
      {},
      {
        action: toRoute(tab),
      }
    );
  };

  const toRoute = (tab: string) => {
    return route.toRoute({
      main: route.user,
      routeSufix: [userID || ""],
      q: {
        tab: tab,
      },
    });
  };
  useEffect(() => {
    console.log("FETCH USER ...")
    initData();
  }, []);

  useEffect(() => {
    if (!open) {
      searchParams.delete(route.user);
      setSearchParams(searchParams, {
        preventScrollReset: true,
      });
    }
  }, [open]);
  return (
    <ModalLayout
      open={open}
      onOpenChange={(e) => {
        setOpen(e);
      }}
      title={fullName(data?.profile?.given_name,data?.profile?.family_name) || ""}
    >
  

      {fetcher.state == "loading" ? (
        <LoadingSpinner />
      ) : (
        <div className="py-2">
          {data?.profile && (
            <TabNavigation
              defaultValue="info"
              items={[
                {
                  label: "Info",
                  value: "info",
                  children: <ProfileInfo profile={data?.profile} />,
                },
              
              ]}
            />
          )}
        </div>
      )}
    </ModalLayout>
  );
}
