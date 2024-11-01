import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import Typography, { title } from "@/components/typography/Typography";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { components } from "~/sdk";
import { loader } from "../../route";

export default function ItemInfoTab() {
  const { t } = useTranslation("common");
  const { item } = useLoaderData<typeof loader>()
  return (
    <div>
      <div className="info-grid">
        <div className=" col-span-full">
          <Typography fontSize={title}>{t("_item.info")}</Typography>
        </div>

        <DisplayTextValue title={t("form.name")} value={item?.name} />

        <DisplayTextValue title={t("_item.code")} value={item?.code} />

        <DisplayTextValue
          title={t("form.item-group")}
          value={item?.group_name}
          to=""
        />

        <DisplayTextValue
          title={t("form.uom")}
          value={item?.uom_name}
        />
      </div>
    </div>
  );
}
