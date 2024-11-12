import { useLoaderData } from "@remix-run/react";
import { loader } from "../route";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useTranslation } from "react-i18next";
import { formatMediumDate } from "~/util/format/formatDate";

export default function RoleTemplateInfo() {
  const { roleTemplate } = useLoaderData<typeof loader>();
  const { t,i18n } = useTranslation("common");
  return (
    <div className=" info-grid">
      <DisplayTextValue value={roleTemplate?.name} 
      title={t("form.name")} />

      <DisplayTextValue 
      value={formatMediumDate(roleTemplate?.created_at,i18n.language)} 
      title={t("table.createdAt")} 
      />
    </div>
  );
}
