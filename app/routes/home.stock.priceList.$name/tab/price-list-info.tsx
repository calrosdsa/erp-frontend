import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { Typography } from "@/components/typography";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { loader } from "../route";

export default function PriceListInfo() {
  const { t } = useTranslation("common");
  const { priceList } = useLoaderData<typeof loader>();
  return (
    <div>
      <div className="info-grid">
        <Typography variant="subtitle2" className=" col-span-full">
          {t("info")}
        </Typography>
        <DisplayTextValue title={t("form.name")} value={priceList?.name} />
        <DisplayTextValue
          title={t("form.currency")}
          value={priceList?.currency}
        />
        <DisplayTextValue
          title={t("_selling.isBuying")}
          value={priceList?.is_buying}
        />
        <DisplayTextValue
          title={t("_selling.isSelling")}
          value={priceList?.is_selling}
        />
      </div>
    </div>
  );
}
