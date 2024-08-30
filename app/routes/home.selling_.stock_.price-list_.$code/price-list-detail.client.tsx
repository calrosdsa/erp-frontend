import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";

export default function PriceListDetailClient() {
  const { priceList } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  return (
    <div>
      <div className="info-grid">
        <Typography fontSize={subtitle} className=" col-span-full">
          {t("info")}
        </Typography>

        {priceList && (
            <>
          <DisplayTextValue title={t("form.name")} value={priceList.Name} />
          <DisplayTextValue title={t("form.currency")} value={priceList.Currency} />
          <DisplayTextValue title={t("_selling.isBuying")} value={priceList.IsBuying} />
          <DisplayTextValue title={t("_selling.isSelling")} value={priceList.IsSelling} />
            </>

        )}
      </div>
    </div>
  );
}
