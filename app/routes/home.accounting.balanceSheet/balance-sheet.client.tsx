import { useLoaderData, useNavigate } from "@remix-run/react";
import FinancialStatementHeader from "../home.accounting.profitAndLoss/components/financial-statement-header";
import { loader } from "./route";
import { BalanceSheetReport } from "./components/balance-sheet-report";
import { route } from "~/util/route";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useTranslation } from "react-i18next";
import { ButtonToolbar } from "~/types/actions";

export default function BalanceSheetClient() {
  const { balanceSheet } = useLoaderData<typeof loader>();
  const {t} = useTranslation("common")
  const r = route;
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
        label: t("cashFlow"),
        onClick: () => {
          navigate(
            r.toRoute({
              main: r.cashFlow,
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
      <BalanceSheetReport data={balanceSheet || []} />
      {/* <BalanceSheetDemo/> */}
    </div>
  );
}
