import { DateTimePicker } from "@/components/custom/datetime/date-time-picker";
import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import AutoSearchMult from "@/components/custom/select/AutoSearchMult";
import CustomSelect from "@/components/custom/select/custom-select";
import { useSearchParams } from "@remix-run/react";
import { format, parse } from "date-fns";
import { useTranslation } from "react-i18next";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { useAccountLedgerDebounceFetcher } from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import { usePartyDebounceFetcher } from "~/util/hooks/fetchers/usePartyDebounceFetcher";

export default function AccountPayableHeader() {
  const { t } = useTranslation("common");
  const [searchParams, setSearchParams] = useSearchParams();
  const [ledgerFetcher, onLedgerChange] = useAccountLedgerDebounceFetcher({
    isGroup: false,
  });
  const defaultValue = format(new Date(), "yyyy-MM-dd");
  const fromDate = parse(
    searchParams.get("fromDate") || defaultValue,
    "yyyy-MM-dd",
    new Date()
  );
  const toDate = parse(
    searchParams.get("toDate") || defaultValue,
    "yyyy-MM-dd",
    new Date()
  );

  const parties: SelectItem[] = [
    { name: t("supplier"), value: partyTypeToJSON(PartyType.supplier) },
    { name: t("customer"), value: partyTypeToJSON(PartyType.customer) },
  ];

  const [partyFetcher, onPartyChange] = usePartyDebounceFetcher({
    partyType: partyTypeToJSON(PartyType.supplier),
  });

  return (
    <div>
      <div className="flex space-x-2">
        <DateTimePicker
          initialDate={fromDate}
          onChange={(e) => {
            searchParams.set("fromDate", format(e, "yyyy-MM-dd"));
            setSearchParams(searchParams, {
              preventScrollReset: true,
            });
          }}
          placeholder={t("form.fromDate")}
        />
        <DateTimePicker
          initialDate={toDate}
          onChange={(e) => {
            searchParams.set("toDate", format(e, "yyyy-MM-dd"));
            setSearchParams(searchParams, {
              preventScrollReset: true,
            });
          }}
          placeholder={t("form.toDate")}
        />

        <AutoSearchMult
          data={partyFetcher.data?.parties || []}
          onValueChange={onPartyChange}
          nameK={"name"}
          valueK={"id"}
          placeholder={t("party")}
          queryName="partyName"
          queryValue="party"
          onSelect={(v) => {
            console.log("SELECTED ITEMS",v)
          }}
          multiple={true}
        />

      </div>
    </div>
  );
}
