import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import Typography, { title } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";

export default function ItemInfo({
  data,
}: {
  data: components["schemas"]["ItemDetailDto"];
}) {
  const { t } = useTranslation("common");
  return (
    <div>
      <div className="info-grid">
        <div className=" col-span-full">
          <Typography fontSize={title}>{t("item.info")}</Typography>
        </div>

        <DisplayTextValue title={t("form.name")} value={data.name} />

        <DisplayTextValue title={t("item.code")} value={data.code} />

        <DisplayTextValue
          title={t("form.item-group")}
          value={data.group?.name}
          to=""
        />

        <DisplayTextValue
          title={t("form.uom")}
          value={data.uom.name}
        />
      </div>
    </div>
  );
}
