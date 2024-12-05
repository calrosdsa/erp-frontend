import { DateTimePicker } from "@/components/custom/datetime/date-time-picker";
import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import AutoSearchMult from "@/components/custom/select/AutoSearchMult";
import CustomSelect from "@/components/custom/select/custom-select";
import { useSearchParams } from "@remix-run/react";
import { format, parse } from "date-fns";
import { useTranslation } from "react-i18next";
import { PartyType, partyTypeToJSON, TimeUnit, timeUnitToJSON } from "~/gen/common";
import { CostCenterSearch } from "~/util/hooks/fetchers/accounting/useCostCenterFetcher";
import { ProjectSearch } from "~/util/hooks/fetchers/accounting/useProjectFetcher";
import { useAccountLedgerDebounceFetcher } from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import { usePartyDebounceFetcher } from "~/util/hooks/fetchers/usePartyDebounceFetcher";

export default function FinancialStatementHeader() {
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
  const periodicity: SelectItem[] = [
    { name: "Mensualemente", value: timeUnitToJSON(TimeUnit.month) },
    { name: "Anualmente", value: timeUnitToJSON(TimeUnit.year) },
  ];

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
          <CustomSelect
          data={periodicity}
          keyName="name"
          defaultValue={searchParams.get("timeUnit") || timeUnitToJSON(TimeUnit.month)}
          placeholder={t("Periodicidad")}
          keyValue="value"
          onValueChange={(e) => {
            searchParams.set("timeUnit", e.value);
            setSearchParams(searchParams, {
              preventScrollReset: true,
            });
          }}
        />
        <ProjectSearch placeholder={t("project")} />
        <CostCenterSearch placeholder={t("costCenter")} />
      </div>
    </div>
  );
}
