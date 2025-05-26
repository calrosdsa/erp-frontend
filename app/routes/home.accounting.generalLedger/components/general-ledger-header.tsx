import { DateTimePicker } from "@/components/custom/datetime/date-time-picker";
import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import CustomSelect from "@/components/custom/select/custom-select";
import { TooltipLayout } from "@/components/layout/tooltip-layout";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "@remix-run/react";
import { format, parse } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { CostCenterSearch, useCostCenterFetcher } from "~/util/hooks/fetchers/accounting/useCostCenterFetcher";
import { ProjectSearch, useProjectFetcher } from "~/util/hooks/fetchers/accounting/useProjectFetcher";
import { useAccountLedgerFetcher } from "~/util/hooks/fetchers/use-account-ledger-fethcer";
import { usePartyDebounceFetcher } from "~/util/hooks/fetchers/usePartyDebounceFetcher";

export default function GeneralLedgerHeader() {
  const { t } = useTranslation("common");
  const [searchParams, setSearchParams] = useSearchParams();
  const [ledgerFetcher, onLedgerChange] = useAccountLedgerFetcher({
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
  const [voucherNo, setVoucherNo] = useState(
    searchParams.get("voucherNo") || ""
  );

  

  const parties: SelectItem[] = [
    { name: t("supplier"), value: partyTypeToJSON(PartyType.supplier) },
    { name: t("customer"), value: partyTypeToJSON(PartyType.customer) },
  ];

  const [partyFetcher, onPartyChange] = usePartyDebounceFetcher({
    partyType: searchParams.get("partyType") || "",
  });

  return (
    <div>
      <div className="flex flex-wrap gap-2">
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
          data={ledgerFetcher.data?.accounts || []}
          onValueChange={onLedgerChange}
          nameK={"name"}
          valueK={"id"}
          placeholder={t("account")}
          queryName="accountName"
          queryValue="account"
          onSelect={() => {}}
        />

        <CustomSelect
          data={parties}
          keyName="name"
          defaultValue={searchParams.get("partyType") || undefined}
          placeholder={t("form.partyType")}
          keyValue="value"
          onValueChange={(e) => {
            searchParams.set("partyType", e.value);
            searchParams.set("partyTypeName", e.name);
            setSearchParams(searchParams, {
              preventScrollReset: true,
            });
          }}
        />

        <AutocompleteSearch
          data={partyFetcher.data?.parties || []}
          onValueChange={onPartyChange}
          nameK={"name"}
          valueK={"id"}
          placeholder={t("form.party")}
          queryName="partyName"
          queryValue="party"
          onSelect={() => {}}
        />
        <ProjectSearch
        placeholder={t("project")}
        />
        <CostCenterSearch
          placeholder={t("costCenter")}
        />
      
        <TooltipLayout content={t("form.voucherNo")}>
          <Input
            placeholder={t("form.voucherNo")}
            className="w-min"
            value={voucherNo}
            onChange={(e) => setVoucherNo(e.target.value)}
            onBlur={(e) => {
              searchParams.set("voucherNo", voucherNo);
              setSearchParams(searchParams, {
                preventScrollReset: true,
              });
            }}
          />
        </TooltipLayout>
      </div>
    </div>
  );
}
