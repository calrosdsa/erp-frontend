import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import { useTranslation } from "react-i18next";
import Typography, { subtitle } from "@/components/typography/Typography";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { formatLongDate } from "~/util/format/formatDate";
import { routes } from "~/util/route";

export default function SupplierClient() {
  const { supplier, actions } = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const r = routes;
  return (
    <div>
      <div className="info-grid">
        <Typography fontSize={subtitle} className=" col-span-full">
          {t("info")}
        </Typography>

        <DisplayTextValue title={t("form.name")} value={supplier?.name} />
        <DisplayTextValue
          title={t("table.createdAt")}
          value={formatLongDate(supplier?.created_at, i18n.language)}
        />
        {supplier && (
          <DisplayTextValue
            title={t("group")}
            value={supplier?.group.name}
            to={r.toSupplierGroup(supplier.group.name, supplier.group.uuid)}
          />
        )}
      </div>
    </div>
  );
}
