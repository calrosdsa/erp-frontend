import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { formatPercentage } from "~/util/format/formatQuantiy";

export default function TaxDetailClient() {
  const { tax } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  return (
    <div>
      <div className=" info-grid">
        <Typography fontSize={subtitle} className="col-span-full">
          {t("info-item", { item: t("_tax.base") })}
        </Typography>

        {tax && (
          <>
            <DisplayTextValue title={t("form.name")} value={tax.name} />
            <DisplayTextValue
              title={t("form.rate")}
              value={formatPercentage(tax.value)}
            />

            <DisplayTextValue
              title={t("form.enabled")}
              value={tax.enabled.toString()}
            />

          </>
        )}
      </div>
    </div>
  );
}
