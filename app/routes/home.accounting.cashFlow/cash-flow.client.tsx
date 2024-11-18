import { useLoaderData, useNavigate } from "@remix-run/react";
import FinancialStatementHeader from "../home.accounting.profitAndLoss/components/financial-statement-header";
import { loader } from "./route";
import CashFlowReportDemo, { CashFlowReport } from "./components/cash-flow-report";
import { useTranslation } from "react-i18next";
import { routes } from "~/util/route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { ButtonToolbar } from "~/types/actions";

export default function CashFlowClient(){
    const {cashFlow} = useLoaderData<typeof loader>()
    const {t} = useTranslation("common")
  const r = routes;
  const navigate = useNavigate();

  setUpToolbar(() => {
    let views: ButtonToolbar[] = [
      {
        label: t("profitAndLoss"),
        onClick: () => {
          navigate(
            r.toRoute({
              main: r.profitAndLoss,
              routePrefix: [r.accountingM],
            })
          );
        },
      },
      {
        label: t("balanceSheet"),
        onClick: () => {
          navigate(
            r.toRoute({
              main: r.balanceSheet,
              routePrefix: [r.accountingM],
            })
          );
        },
      },
    ];
    return {
      view: views,
      viewTitle: t("financialStatement"),
    };
  }, []);
    return (
        <div className="grid gap-y-2">
      <FinancialStatementHeader />
      {/* <CashFlowReportDemo/> */}
      <CashFlowReport
      data={cashFlow || []}
      />
        </div>
    )
}