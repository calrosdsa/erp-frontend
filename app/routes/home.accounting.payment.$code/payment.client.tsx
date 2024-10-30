import { useFetcher, useLoaderData, useNavigate, useOutletContext, useSearchParams } from "@remix-run/react";
import { action, loader } from "./route";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { routes } from "~/util/route";
import { useTranslation } from "react-i18next";
import { formatMediumDate } from "~/util/format/formatDate";
import Typography, { subtitle } from "@/components/typography/Typography";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "~/util/format/formatCurrency";
import { DEFAULT_CURRENCY } from "~/constant";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { PartyType, partyTypeToJSON, stateFromJSON } from "~/gen/common";
import DetailLayout from "@/components/layout/detail-layout";
import PaymentInfoTab from "./tab/payment-info";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { updateStateWithEventSchema } from "~/util/data/schemas/base/base-schema";
import { z } from "zod";

export default function PaymentDetailClient() {
  const { paymentData, actions,associatedActions,activities } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>()
  const globalState = useOutletContext<GlobalState>()
  const [searchParams ] = useSearchParams()
  const tab = searchParams.get("tab")
  const { t, i18n } = useTranslation("common");
  const r = routes;
  const navigate = useNavigate();

  const tabs =[
    {
      title: t("info"),
      href: r.toModulePartyDetail("accounting",partyTypeToJSON(PartyType.payment), paymentData?.code || "", {
        tab: "info",
      }),
    },
  ]

  setUpToolbar(()=>{
    return {
      status:stateFromJSON(paymentData?.status),
      onChangeState: (e) => {
        const body: z.infer<typeof updateStateWithEventSchema> = {
          current_state: paymentData?.status || "",
          party_id: paymentData?.code || "",
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
  },[paymentData])

  return (
    <DetailLayout
    activities={activities}
    partyID={paymentData?.id}
    navItems={tabs}
    >
      {tab == "info" && 
      <PaymentInfoTab/>
      }

    </DetailLayout>
  );
}
