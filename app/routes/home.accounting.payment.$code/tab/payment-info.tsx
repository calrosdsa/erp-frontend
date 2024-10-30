import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
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
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { loader } from "../route";

export default function PaymentInfoTab(){
    const { paymentData, actions,associatedActions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>()
  const [ledgerPermission] = usePermission({
    roleActions:globalState.roleActions,
    actions:associatedActions && associatedActions[partyTypeToJSON(PartyType.ledger)]
  })
  const { t, i18n } = useTranslation("common");
    return (
<div>
      <div className=" info-grid">
        <Typography className=" col-span-full" fontSize={subtitle}>
          {t("_payment.type")}
        </Typography>
    

        <DisplayTextValue
          title={t("form.paymentType")}
          value={paymentData?.payment_type}
        />

        <DisplayTextValue
          title={t("form.postingDate")}
          value={formatMediumDate(paymentData?.posting_date, i18n.language)}
        />

        <Separator className=" col-span-full" />
        <Typography className=" col-span-full" fontSize={subtitle}>
          {t("_payment.paymentFromTo")}
        </Typography>

        <DisplayTextValue
          title={t("form.party")}
          value={paymentData?.party_name}
        />

        <Separator className=" col-span-full" />

        <Typography className=" col-span-full" fontSize={subtitle}>
          {t("form.amount")}
        </Typography>

        <DisplayTextValue
          title={t("form.amount")}
          value={formatCurrency(
            paymentData?.amount,
            paymentData?.paid_from_currency || DEFAULT_CURRENCY,
            i18n.language
          )}
        />

        {ledgerPermission?.view &&
        <>
        <Separator className=" col-span-full" />

        <Typography className=" col-span-full" fontSize={subtitle}>
          {t("accounts")}
        </Typography>
        <div className="grid gap-y-3">
          <DisplayTextValue
            title={t("_ledger.paidFrom")}
            value={paymentData?.paid_from_name}
          />
          <DisplayTextValue
            title={t("_ledger.currency",{o:t("form.from")})}
            value={paymentData?.paid_from_currency}
          />
        </div>
        <div className="grid gap-y-3">
          <DisplayTextValue
            title={t("_ledger.paidTo")}
            value={paymentData?.paid_to_name}
            />

          <DisplayTextValue
            title={t("_ledger.currency",{o:t("form.to")})}
            value={paymentData?.paid_to_currency}
            />
        </div>
            </>
          }
      </div>
    </div>
    )
}