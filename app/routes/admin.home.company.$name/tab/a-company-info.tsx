import { useLoaderData } from "@remix-run/react";
import { loader } from "../route";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useTranslation } from "react-i18next";
import { formatLongDate, formatMediumDate } from "~/util/format/formatDate";

export default function ACompanyInfo() {
  const { company } = useLoaderData<typeof loader>();
  const {t,i18n} = useTranslation("common")
  return (
    <div className=" info-grid">
      <DisplayTextValue 
      title={t("form.name")} 
      value={company?.name}
      />
      {/* <DisplayTextValue 
      title={t("table.createdAt")} 
      value={formatMediumDate(company?.created_at,i18n.language)}
      /> */}
    </div>
  );
}
