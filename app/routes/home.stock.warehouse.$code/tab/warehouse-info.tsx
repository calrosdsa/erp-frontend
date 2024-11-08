import { useLoaderData } from "@remix-run/react";
import { loader } from "../route";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { formatLongDate } from "~/util/format/formatDate";
import { PartyAddresses } from "~/routes/home.party/components/party-addresses";
import { PartyContacts } from "~/routes/home.party/components/party-contacts";

export default function WarehouseInfo() {
  const { warehouse,addresses,contacts} = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");

  return (
    <div>
      <div className="info-grid-sidebar">
        <DisplayTextValue title={t("form.name")} value={warehouse?.name} />

        <DisplayTextValue
          title={t("form.enabled")}
          value={warehouse?.enabled}
        />

        <DisplayTextValue
          title={t("table.createdAt")}
          value={formatLongDate(warehouse?.created_at, i18n.language)}
        />
      </div>

      <div className=" xl:grid xl:grid-cols-2 gap-4 ">
        <PartyAddresses
        addresses={addresses}
        partyID={warehouse?.id}
        />

        <PartyContacts
        contacts={contacts}
        partyID={warehouse?.id}
        />
      </div>
    </div>
  );
}
