import { DateTimePicker } from "@/components/custom/datetime/date-time-picker";
import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import AutoSearchMult from "@/components/custom/select/AutoSearchMult";
import CustomSelect from "@/components/custom/select/custom-select";
import { useSearchParams } from "@remix-run/react";
import { format, parse } from "date-fns";
import { useTranslation } from "react-i18next";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { CostCenterSearch } from "~/util/hooks/fetchers/accounting/use-cost-center-fetcher";
import { ProjectSearch } from "~/util/hooks/fetchers/accounting/use-project-fetcher";
import { useAccountLedgerFetcher } from "~/util/hooks/fetchers/use-account-ledger-fetcher";
import { usePartyDebounceFetcher } from "~/util/hooks/fetchers/usePartyDebounceFetcher";

export default function AccountReportHeader({partyType}:{
  partyType:string
}) {
  const { t } = useTranslation("common");
  const [searchParams, setSearchParams] = useSearchParams();

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



  const [partyFetcher, onPartyChange] = usePartyDebounceFetcher({
    partyType: partyType,
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

        <AutocompleteSearch
          data={partyFetcher.data?.parties || []}
          onValueChange={onPartyChange}
          nameK={"name"}
          valueK={"id"}
          placeholder={t("form.party")}
          queryName="partyName"
          queryValue="party"
          onSelect={(v) => {
            console.log("SELECTED ITEMS", v);
          }}
        />

        <ProjectSearch placeholder={t("project")} />
        <CostCenterSearch placeholder={t("costCenter")} />
      </div>
    </div>
  );
}
