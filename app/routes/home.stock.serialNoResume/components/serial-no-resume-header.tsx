import { DateTimePicker } from "@/components/custom/datetime/date-time-picker";
import AutocompleteSearch from "@/components/custom/select/AutocompleteSearch";
import AutoSearchMult from "@/components/custom/select/AutoSearchMult";
import CustomSelect from "@/components/custom/select/custom-select";
import { TooltipLayout } from "@/components/layout/tooltip-layout";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "@remix-run/react";
import { format, parse } from "date-fns";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useItemDebounceFetcher } from "~/util/hooks/fetchers/useItemDebounceFetcher";
import { useWarehouseDebounceFetcher } from "~/util/hooks/fetchers/useWarehouseDebounceFetcher";

export default function SerialNumberResumeHeader() {
  const { t } = useTranslation("common");
  const [searchParams, setSearchParams] = useSearchParams();
  const [voucherNo, setVoucherNo] = useState(
    searchParams.get("voucherNo") || ""
  );
  const [serialNo, setSerialNo] = useState(
    searchParams.get("serialNo") || ""
  );
  const [batchBundleNo, setBatchBundleNo] = useState(
    searchParams.get("batchBundleNo") || ""
  );
  const [itemFetcher, onItemChange] = useItemDebounceFetcher();
  const [warehouseFetcher, onWareHouseChange] = useWarehouseDebounceFetcher({
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
          data={itemFetcher.data?.items || []}
          onValueChange={onItemChange}
          nameK={"name"}
          valueK={"id"}
          placeholder={t("item")}
          queryName="itemName"
          queryValue="item"
          onSelect={() => {}}
        />

        <AutocompleteSearch
          data={warehouseFetcher.data?.warehouses || []}
          onValueChange={onWareHouseChange}
          nameK={"name"}
          valueK={"id"}
          placeholder={t("warehouse")}
          queryName="warehouseName"
          queryValue="warehouse"
          onSelect={() => {}}
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
        <TooltipLayout content={t("batchBundle")}>
          <Input
            placeholder={t("batchBundle")}
            className="w-min"
            value={batchBundleNo}
            onChange={(e) => setBatchBundleNo(e.target.value)}
            onBlur={(e) => {
              searchParams.set("batchBundleNo", batchBundleNo);
              setSearchParams(searchParams, {
                preventScrollReset: true,
              });
            }}
          />
        </TooltipLayout>
        <TooltipLayout content={t("serialNo")}>
          <Input
            placeholder={t("serialNo")}
            className="w-min"
            value={serialNo}
            onChange={(e) =>setSerialNo(e.target.value)}
            onBlur={(e) => {
              searchParams.set("serialNo", serialNo);
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
