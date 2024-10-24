import Typography, { subtitle } from "@/components/typography/Typography";
import { loader } from "../../route";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { formatLongDate } from "~/util/format/formatDate";
import { PartyType } from "~/gen/common";
import { routes } from "~/util/route";
import { PartyAddresses } from "~/routes/home.party/components/party-addresses";
import { PartyContacts } from "~/routes/home.party/components/party-contacts";

export default function CustomerInfo() {
  const { customer, addresses,contacts } = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate()
  const r = routes;
  return (
    <div>
      <div className="info-grid">
        <Typography className="col-span-full" fontSize={subtitle}>
          {t("_customer.info")}
        </Typography>

        <DisplayTextValue value={customer?.name} title={t("form.name")} />
        <DisplayTextValue
          value={customer?.customer_type}
          title={t("form.type")}
        />
        <DisplayTextValue
          value={formatLongDate(customer?.created_at, i18n.language)}
          title={t("table.createdAt")}
        />
        <DisplayTextValue
          value={customer?.group_name}
          title={t("_group.base")}
          to={r.toGroupsByParty(PartyType.customerGroup)}
        />
      </div>

      <div className=" xl:grid xl:grid-cols-2 gap-4 items-start">
        <PartyAddresses
          addresses={addresses}
          onAddAddress={() => {
            navigate(r.toCreateAddress(customer?.id));
          }}
        />

        <PartyContacts
          contacts={contacts}
          onAddContact={() => {
            navigate(r.toCreateContact(customer?.id));
          }}
        />
      </div>
    </div>
  );
}
