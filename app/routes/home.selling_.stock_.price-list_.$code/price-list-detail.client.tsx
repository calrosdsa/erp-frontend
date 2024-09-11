import { useLoaderData, useOutletContext } from "@remix-run/react";
import { loader } from "./route";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";

export default function PriceListDetailClient() {
  const { priceList,actions } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const globalState = useOutletContext<GlobalState>()
  const [permission] = usePermission({
    actions:actions,
    roleActions:globalState.roleActions,
  })  
  return (
    <div>
      <div className="info-grid">
        <Typography fontSize={subtitle} className=" col-span-full">
          {t("info")}
        </Typography>
          <DisplayTextValue title={t("form.name")} value={priceList?.name} />
          <DisplayTextValue title={t("form.currency")} value={priceList?.currency} />
          <DisplayTextValue title={t("_selling.isBuying")} value={priceList?.is_buying} />
          <DisplayTextValue title={t("_selling.isSelling")} value={priceList?.is_selling} />

      </div>
    </div>
  );
}
