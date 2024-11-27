import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import QuotationInfoTab from "./components/tab/quotation-info";
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
import QuotationConnections from "./components/tab/quotation-connections";
import { format } from "date-fns";
import { ButtonToolbar } from "~/types/actions";

export default function QuotationDetailClient() {
  const { quotation, actions, activities } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const { t, i18n } = useTranslation("common");

  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const toolbar = useToolbar();
  const fetcher = useFetcher<typeof action>();
  const params = useParams();
  const quotationParty = params.quotationParty || ""
  const navigate = useNavigate();
  const r = routes;
  const toRoute = (tab: string) => {
    return r.toRoute({
      main: r.supplierQuotation,
      routePrefix: [r.quotation],
      routeSufix: [quotation?.code || ""],
      q: {
        tab: tab,
      },
    });
  };

  const navItems = [
    {
      title: t("info"),
      href: toRoute("info"),
    },
    {
      title: t("connections"),
      href: toRoute("connections"),
    },
  ];

  setUpToolbar(() => {
    let actions: ButtonToolbar[] = [];
    
    return {
      titleToolbar: `${t(quotationParty)}(${quotation?.code})`,
      status: stateFromJSON(quotation?.status),
      actions: actions,
      onChangeState: (e) => {
        const body: z.infer<typeof updateStateWithEventSchema> = {
          current_state: quotation?.status || "",
          party_type: params.partyReceipt || "",
          party_id: quotation?.code || "",
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
    };
  }, [quotation]);

  useEffect(() => {
    if (fetcher.state == "submitting") {
      toolbar.setLoading(true);
    } else {
      toolbar.setLoading(false);
    }
  }, [fetcher.state]);

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
    },
    [fetcher.data]
  );

  // useEffect(() => {
  //   setUpToolBar();
  // }, [quotation]);

  return (
    <DetailLayout
      activities={activities}
      partyID={quotation?.id}
      navItems={navItems}
    >
      {tab == "info" && <QuotationInfoTab />}
      {tab == "connections" && <QuotationConnections />}
    </DetailLayout>
  );
}
