import { useLoaderData, useNavigate } from "@remix-run/react";
import { loader } from "./route";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { routes } from "~/util/route";
import { useTranslation } from "react-i18next";
import { formatMediumDate } from "~/util/format/formatDate";
import Typography, { subtitle } from "@/components/typography/Typography";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "~/util/format/formatCurrency";

export default function PaymentDetailClient() {
  const { paymentData, actions } = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const r = routes;
  const navigate = useNavigate();
  return (
    <div>
      <div className=" info-grid">
        <Typography className=" col-span-full" fontSize={subtitle}>
          {t("_payment.type")}
        </Typography>
        <DisplayTextValue
          title={t("form.status")}
          value={t(paymentData?.status || "")}
        />

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
            paymentData?.paid_from_currency,
            i18n.language
          )}
        />

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
      </div>
    </div>
  );
}
