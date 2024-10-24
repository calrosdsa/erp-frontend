import { DateTimePicker } from "@/components/custom/datetime/date-time-picker";
import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import CustomSelect from "@/components/custom/select/custom-select";
import { useSearchParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { useAccountLedgerDebounceFetcher } from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import { usePartyDebounceFetcher } from "~/util/hooks/fetchers/usePartyDebounceFetcher";

export default function GeneralLedgerHeader() {
  const { t } = useTranslation("common");
  const [searchParams,setSearchParams] = useSearchParams()
  const [ledgerFetcher, onLedgerChange] = useAccountLedgerDebounceFetcher({
    isGroup: false,
  });
  const parties:SelectItem[]= [
    {name:t("supplier"),value:partyTypeToJSON(PartyType.supplier)}
  ]

  const [partyFetcher, onPartyChange] = usePartyDebounceFetcher({
    partyType: searchParams.get("partyType")  || "",
  });

  return (
    <div>
      <div className="flex space-x-2">
        <DateTimePicker onChange={(e) => {}} placeholder={t("form.fromDate")} />
        <DateTimePicker onChange={(e) => {}} placeholder={t("form.toDate")} />

        
        <AutocompleteSearch
          data={ledgerFetcher.data?.accounts || []}
          onValueChange={onLedgerChange}
          nameK={"name"}
          valueK={"id"}
          placelholder={t("account")}
          queryName="accountName"
          queryValue="account"
          onSelect={() => {}}
        />

        <CustomSelect
        data={parties}
        keyName="name"
        keyValue="value"
        onValueChange={(e)=>{
            searchParams.set("partyType",e.value)
            searchParams.set("partyTypeName",e.name)
            setSearchParams(searchParams,{
                preventScrollReset:true
            })
        }}
        />

        <AutocompleteSearch
          data={partyFetcher.data?.parties || []}
          onValueChange={onPartyChange}
          nameK={"name"}
          valueK={"id"}
          placelholder={t("party")}
          queryName="partyName"
          queryValue="party"
          onSelect={() => {}}
        />
      </div>
    </div>
  );
}
