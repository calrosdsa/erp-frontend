import { useLoaderData, useNavigate } from "@remix-run/react";
import { loader } from "./route";
import { useTranslation } from "react-i18next";
import Typography, { subtitle } from "@/components/typography/Typography";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { formatLongDate } from "~/util/format/formatDate";
import { routes } from "~/util/route";
import Addresses from "../home.address_/route";
import { PartyAddresses } from "../home.party/components/party-addresses";
import { PartyContacts } from "../home.party/components/party-contacts";

export default function SupplierClient() {
  const { supplier, actions,addresses,contacts } = useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const navigate = useNavigate()
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
            title={t("_group.base")}
            value={supplier?.group?.name}
            to={r.toSupplierGroup(supplier.group?.name, supplier.group?.uuid)}
          />
        )}
      </div>
      <div className=" xl:grid xl:grid-cols-2 gap-4 ">
        <PartyAddresses
        addresses={addresses}
        onAddAddress={()=>{
          navigate(r.toCreateAddress(supplier?.id))
        }}
        />

        <PartyContacts
        contacts={contacts}
        onAddContact={()=>{
          navigate(r.toCreateContact(supplier?.id))
        }}
        />
      </div>
    </div>
  );
}
