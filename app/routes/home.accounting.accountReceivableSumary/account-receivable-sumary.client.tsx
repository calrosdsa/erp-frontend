import { useLoaderData, useNavigate } from "@remix-run/react";
import { loader } from "./route";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/custom/table/CustomTable";
import { components } from "~/sdk";
import { DEFAULT_CURRENCY } from "~/constant";
import { useMemo } from "react";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { ButtonToolbar } from "~/types/actions";
import { useTranslation } from "react-i18next";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { route } from "~/util/route";
import { accountReceivableSumaryColumns } from "@/components/custom/table/columns/accounting/account-receivable-sumary-columns";
import AccountReportHeader from "../home.accounting.accountPayable/components/account-report-header";
import { party } from "~/util/party";
import { ListLayout } from "@/components/ui/custom/list-layout";

interface LedgerData {
  Name: string;
}

export default function AccountReceivableSumaryClient() {
  const { accountReceivableSumary } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const r = route;
  const navigate = useNavigate();
  const total = useMemo(() => {
    const totalInvoiceAmount = accountReceivableSumary?.reduce(
      (prev, acc) => prev + acc.total_invoiced_amount,
      0
    );
    const totalPaidAmount = accountReceivableSumary?.reduce(
      (prev, acc) => prev + acc.total_paid_amount,
      0
    );
    const totalOutstanding =
      Number(totalPaidAmount) - Number(totalInvoiceAmount);
    return {
      totalInvoiceAmount,
      totalPaidAmount,
      totalOutstanding,
    };
  }, [accountReceivableSumary]);

  setUpToolbar(() => {
    let view: ButtonToolbar[] = [];
    view.push({
      label: t("accountReceivable"),
      onClick: () => {
        navigate(
          r.toRoute({
            main: r.accountReceivable,
            routePrefix: [r.accountingM],
            q: {
              fromDate: format(startOfMonth(new Date()) || "", "yyyy-MM-dd"),
              toDate: format(endOfMonth(new Date()) || "", "yyyy-MM-dd"),
            },
          })
        );
      },
    });
    return {
      view: view,
    };
  }, []);

  return (
    <div>
      <ListLayout title="Resumen de Cuentas por Cobrar">
        <Card>
          <CardHeader>
            <AccountReportHeader partyType={party.customer} />
          </CardHeader>
          <CardContent className="px-2 py-3">
            <DataTable
              data={[
                ...(accountReceivableSumary || []),
                {
                  total_paid_amount: total.totalPaidAmount,
                  total_invoiced_amount: total.totalInvoiceAmount,
                  currency:
                    accountReceivableSumary != undefined &&
                    accountReceivableSumary.length > 0
                      ? accountReceivableSumary[0]?.currency
                      : DEFAULT_CURRENCY,
                } as components["schemas"]["SumaryEntryDto"],
              ]}
              columns={accountReceivableSumaryColumns({})}
            />
          </CardContent>
        </Card>
      </ListLayout>
    </div>
  );
}
