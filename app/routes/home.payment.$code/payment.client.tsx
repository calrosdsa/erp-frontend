import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { action, loader } from "./route";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { route } from "~/util/route";
import { useTranslation } from "react-i18next";
import { GlobalState } from "~/types/app-types";
import { PartyType, partyTypeToJSON, stateFromJSON } from "~/gen/common";
import DetailLayout from "@/components/layout/detail-layout";
import PaymentInfoTab from "./tab/payment-info";
import {
  setUpToolbar,
  setUpToolbarDetailPage,
  setUpToolbarRegister,
  setUpToolbarTab,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { updateStatusWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";
import { ButtonToolbar } from "~/types/actions";
import { format } from "date-fns";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { DownloadIcon } from "lucide-react";
import { components } from "~/sdk";
import { party } from "~/util/party";
import { useExporter } from "~/util/hooks/ui/useExporter";
import { Entity } from "~/types/enums";

export default function PaymentDetailClient() {
  const { payment, actions, activities } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const globalState = useOutletContext<GlobalState>();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const { t, i18n } = useTranslation("common");
  const r = route;
  const navigate = useNavigate();
  const params = useParams();
  const { exportPdf } = useExporter();

  const tabs = [
    {
      title: t("info"),
      href: r.toModulePartyDetail(
        "accounting",
        partyTypeToJSON(PartyType.payment),
        payment?.code || "",
        {
          tab: "info",
        }
      ),
    },
  ];




  setUpToolbarRegister(() => {
    let actions: ButtonToolbar[] = [];
    actions.push({
      label: t("accountingLedger"),
      onClick: () => {
        navigate(
          r.toRoute({
            main: "generalLedger",
            routePrefix: [r.accountingM],
            q: {
              fromDate: format(payment?.created_at || "", "yyyy-MM-dd"),
              toDate: format(payment?.created_at || "", "yyyy-MM-dd"),
              voucherNo: payment?.code,
            },
          })
        );
      },
    });
    actions.push({
      label: t("form.download"),
      Icon: DownloadIcon,
      onClick: () => {
        const exportData: components["schemas"]["ExportDocumentData"] = {
          id: params.code || "",
        };
        exportPdf("/payment/export/document", exportData);
      },
    });
    return {
      actions: actions,
      titleToolbar:payment?.code,
      status: stateFromJSON(payment?.status),
      onChangeState: (e) => {
        const body: z.infer<typeof updateStatusWithEventSchema> = {
          current_state: payment?.status || "",
          party_id: payment?.code || "",
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
  }, [payment]);

   useLoadingTypeToolbar(
      {
        loading: fetcher.state == "submitting",
        loadingType: "STATE",
      },
      [fetcher.state]
    );

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
    },
    [fetcher.data]
  );
  return (
    <DetailLayout
      activities={activities}
      partyID={payment?.id}
      navItems={tabs}
      fullWidth={true}
      partyName={payment?.code}
      entityID={Entity.PAYMENT}
    >
      {tab == "info" && <PaymentInfoTab />}
    </DetailLayout>
  );
}
