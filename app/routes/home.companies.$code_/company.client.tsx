import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import Typography, { subtitle } from "@/components/typography/Typography";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { formatLongDate } from "~/util/format/formatDate";

export default function CompanyClient() {
  const { company } = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  return (
    <div>
      <div className=" info-grid">
        <Typography fontSize={subtitle} className=" col-span-full">
          {t("info")}
        </Typography>

        {company && (
          <>
            <DisplayTextValue value={company.Name} title={t("form.name")} />
            <DisplayTextValue
              value={formatLongDate(company.CreatedAt, i18n.language)}
              title={t("table.createdAt")}
            />

            <DisplayTextValue
              value={company.SiteUrl}
              title={t("form.siteUrl")}
            />

            <DisplayTextValue
              value={company.Logo}
              title={t("form.logo")}
            />
          </>
        )}
      </div>
    </div>
  );
}
