import { useLoaderData, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import { components } from "~/sdk";
import { ProfitLossStatement } from "./components/profit-loss-component";
import {
  endOfMonth,
  endOfYear,
  format,
  startOfMonth,
  startOfYear,
} from "date-fns";
import ProfitAndLossHeader from "./components/profit-and-loss-header";
import { TimeUnit, timeUnitToJSON } from "~/gen/common";
type GroupedAccounts = {
  [accountType: string]: {
    [date: string]: AccountEntry[];
  };
};
type AccountEntry = components["schemas"]["ProfitAndLossEntryDto"];
const data: AccountEntry[] = [
  {
    account_type: "COST_OF_GOODS_SOLD",
    account_name: "Cost Of Goods Sold",
    posting_date: "2024-11-01T00:00:00Z",
    credit: 0,
    debit: 35000,
  },
  {
    account_type: "COST_OF_GOODS_SOLD",
    account_name: "Cost Of Goods Sold",
    posting_date: "2024-10-01T00:00:00Z",
    credit: 0,
    debit: 30000,
  },
  {
    account_type: "SALES_REVENUE",
    account_name: "Sales",
    posting_date: "2024-11-01T00:00:00Z",
    credit: 30000,
    debit: 0,
  },
  {
    account_type: "SALES_REVENUE",
    account_name: "Sales External",
    posting_date: "2024-10-01T00:00:00Z",
    credit: 36000,
    debit: 0,
  },
  {
    account_type: "SALES_REVENUE",
    account_name: "Sales External",
    posting_date: "2024-02-01T00:00:00Z",
    credit: 102000,
    debit: 0,
  },
  {
    account_type: "COST_OF_GOODS_SOLD",
    account_name: "Cost Of Goods Sold",
    posting_date: "2024-02-01T00:00:00Z",
    credit: 0,
    debit: 55000,
  },
];
export default function ProfitAndLossClient() {
  const { profitAndLoss } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const fromDate =
    searchParams.get("fromDate") ||
    format(startOfMonth(new Date()), "yyyy-MM-dd");
  const toDate =
    searchParams.get("toDate") || format(endOfMonth(new Date()), "yyyy-MM-dd");
  const timeUnit =
    searchParams.get("time_unit") || timeUnitToJSON(TimeUnit.month);

  return (
    <div className="grid gap-y-2">
      <ProfitAndLossHeader />
      <ProfitLossStatement
        data={profitAndLoss || []}
        startDate={fromDate}
        endDate={toDate}
        timeUnit={timeUnit}
      />

      {/* <ProfitLossDemo /> */}
    </div>
  );
}
