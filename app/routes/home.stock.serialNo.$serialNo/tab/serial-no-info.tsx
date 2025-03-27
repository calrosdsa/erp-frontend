import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { loader } from "../route";

export default function SerialNoInfo() {
  const { t } = useTranslation("common");
  const { serialNo } = useLoaderData<typeof loader>();
  return (
    <div className="detail-grid">
      <DisplayTextValue title={t("serialNo")} value={serialNo?.serial_no} />

      <DisplayTextValue title={t("item")} value={serialNo?.item_name} />

      <DisplayTextValue title={t("warehouse")} value={serialNo?.warehouse} />
    </div>
  );
}
