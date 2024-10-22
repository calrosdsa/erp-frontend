import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import ReceiptInfoTab from "./components/tab/receipt-info";
import { useTranslation } from "react-i18next";
import { useToolbar } from "~/util/hooks/ui/useToolbar";
import { stateFromJSON } from "~/gen/common";
import { updateStateWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import DetailLayout from "@/components/layout/detail-layout";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { routes } from "~/util/route";
import ReceiptConnectionsTab from "./components/tab/receipt-connections";

export default function ReceiptDetailClient() {
  const { receipt,itemLines, actions,activities} = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const { t, i18n } = useTranslation("common");
  const { toast } = useToast();
  const [permission] = usePermission({
    actions: actions,
    roleActions: globalState.roleActions,
  });
  const [searchParams] = useSearchParams()
  const tab = searchParams.get("tab")
  const toolbar = useToolbar();
  const fetcher = useFetcher<typeof action>();
  const params = useParams();
  const r = routes

  const navItems = [
    {
      title: t("info"),
      href: r.toReceiptDetail(params.partyReceipt || "",receipt?.code || ""),
    },
    {
      title: t("connections"),
      href: r.toReceiptDetail(params.partyReceipt || "",receipt?.code || "","connections"),
    },
  ];
 

  setUpToolbar(()=>{
    return {
      title: `${t("_receipt.base")}(${receipt?.code})`,
      status: stateFromJSON(receipt?.status),
      onChangeState: (e) => {
        const body: z.infer<typeof updateStateWithEventSchema> = {
          current_state: receipt?.status || "",
          party_type: params.partyReceipt || "",
          party_id: receipt?.code || "",
          events: [e],
        };
        fetcher.submit(
          {
            action: "update-state-with-event",
            updateStateWithEvent: body,
          },
          {
            method: "POST",
            encType: "application/json",
          }
        );
      },
    }
  },[receipt])

  useEffect(() => {
    if (fetcher.state == "submitting") {
      toolbar.setLoading(true);
    } else {
      toolbar.setLoading(false);
    }
  }, [fetcher.state]);

  useDisplayMessage({
    error:fetcher.data?.error,
    success:fetcher.data?.message,
  },[fetcher.data])


  // useEffect(() => {
  //   setUpToolBar();
  // }, [receipt]);

  return (
    <DetailLayout
    activities={activities}
    partyID={receipt?.id}
    navItems={navItems}
    >
      {tab == "info" && 
      <ReceiptInfoTab/>
      }
      {tab == "connections" && 
      <ReceiptConnectionsTab/>
      }
    </DetailLayout>
  );
}
