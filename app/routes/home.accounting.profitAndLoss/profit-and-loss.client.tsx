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
