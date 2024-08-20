import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import Typography, { title } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";

export default function ItemInfo({
  data,
}: {
  data: components["schemas"]["Item"];
}) {
  const { t } = useTranslation();
  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
        <div className=" col-span-full">
          <Typography fontSize={title}>{t("item.info")}</Typography>
        </div>

        <DisplayTextValue title={t("form.name")} value={data.Name} />

        <DisplayTextValue title={t("item.code")} value={data.Code} />

        <DisplayTextValue
          title={t("form.item-group")}
          value={data.ItemGroup.Name}
          to=""
        />

        <DisplayTextValue title={t("form.uom")} value={data.UnitOfMeasure.UnitOfMeasureTranslation?.Name || ""} />
      </div>
    </div>
  );
}
