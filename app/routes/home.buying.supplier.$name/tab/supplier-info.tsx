import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { Typography } from "@/components/typography";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { PartyAddresses } from "~/routes/home.party/components/party-addresses";
import { PartyContacts } from "~/routes/home.party/components/party-contacts";
import { formatLongDate } from "~/util/format/formatDate";
import { routes } from "~/util/route";
import { loader } from "../route";


export default function SupplierInfo(){
    const { supplier, actions,addresses,contacts } = useLoaderData<typeof loader>();
    const { t, i18n } = useTranslation("common");
    const navigate = useNavigate()
    const r = routes;
  
    return (
        <>
        <div className="info-grid">
        <Typography variant="title2" className=" col-span-full">
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
        </>
    )
}