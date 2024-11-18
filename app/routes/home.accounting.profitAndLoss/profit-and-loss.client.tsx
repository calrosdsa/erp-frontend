import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
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
import FinancialStatementHeader from "./components/financial-statement-header";
import { TimeUnit, timeUnitToJSON } from "~/gen/common";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { ButtonToolbar } from "~/types/actions";
import { useTranslation } from "react-i18next";
import { routes } from "~/util/route";
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
  const { t } = useTranslation("common");
  const [searchParams] = useSearchParams();
  const fromDate =
    searchParams.get("fromDate") ||
    format(startOfMonth(new Date()), "yyyy-MM-dd");
  const toDate =
    searchParams.get("toDate") || format(endOfMonth(new Date()), "yyyy-MM-dd");
  const timeUnit =
    searchParams.get("time_unit") || timeUnitToJSON(TimeUnit.month);
  const r = routes
  const navigate = useNavigate()

  setUpToolbar(() => {
    let views: ButtonToolbar[] = [
      {
        label: t("cashFlow"),
        onClick: () => {
          navigate(r.toRoute({
            main:r.cashFlow,
            routePrefix:[r.accountingM]
          }));
        },
      },
      {
        label: t("balanceSheet"),
        onClick: () => {
          navigate(r.toRoute({
            main:r.balanceSheet,
            routePrefix:[r.accountingM]
          }));
        },
      },
    ];
    return {
      view:views,
      viewTitle:t("financialStatement")
    };
  }, []);

  return (
    <div className="grid gap-y-2">
      <FinancialStatementHeader />
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
