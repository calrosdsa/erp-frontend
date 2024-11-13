import DetailLayout from "@/components/layout/detail-layout";
import { useLoaderData } from "@remix-run/react";
import { loader } from "../route";
import { useTranslation } from "react-i18next";
import { subtitle } from "@/components/typography/Typography";
import { Typography } from "@/components/typography";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { formatLongDate } from "~/util/format/formatDate";


export default function CompanyInfo(){
    const { company } = useLoaderData<typeof loader>();
    const { t, i18n } = useTranslation("common");
    return (
        <div>
      <div className=" info-grid">

        {company && (
          <>
            <DisplayTextValue value={company.name} title={t("form.name")} />
            <DisplayTextValue
              value={formatLongDate(company.created_at, i18n.language)}
              title={t("table.createdAt")}
            />

            <DisplayTextValue
              value={company.site_url}
              title={t("form.siteUrl")}
            />

            <DisplayTextValue
              value={company.logo}
              title={t("form.logo")}
            />
          </>
        )}
      </div>
    </div>
    )
}