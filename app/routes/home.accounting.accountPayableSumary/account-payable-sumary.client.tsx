import { useLoaderData, useNavigate } from "@remix-run/react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/custom/table/CustomTable";
import { components } from "~/sdk";
import { DEFAULT_CURRENCY } from "~/constant";
import { useMemo } from "react";
import { accountPayableSumaryColumns } from "@/components/custom/table/columns/accounting/account-payable-sumary-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { ButtonToolbar } from "~/types/actions";
import { useTranslation } from "react-i18next";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { route } from "~/util/route";
import { loader } from "./route";
import AccountReportHeader from "../home.accounting.accountPayable/components/account-report-header";
import { party } from "~/util/party";
import { ListLayout } from "@/components/ui/custom/list-layout";

export default function AccountPayableSumaryClient() {
  const { accountPayableSumary } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const r = route;
  const navigate = useNavigate();
  const total = useMemo(() => {
    const totalInvoiceAmount = accountPayableSumary?.reduce(
      (prev, acc) => prev + acc.total_invoiced_amount,
      0
    );
    const totalPaidAmount = accountPayableSumary?.reduce(
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
  }, [accountPayableSumary]);

  setUpToolbar(() => {
    let view: ButtonToolbar[] = [];
    view.push({
      label: t("accountPayable"),
      onClick: () => {
        navigate(
          r.toRoute({
            main: r.accountPayable,
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
      <ListLayout title="Resumen de Cuentas por Pagar">
        <Card>
          <CardHeader>
            <AccountReportHeader partyType={party.supplier} />
          </CardHeader>
          <CardContent className="px-2 py-3">
            <DataTable
              data={[
                ...(accountPayableSumary || []),
                {
                  total_paid_amount: total.totalPaidAmount,
                  total_invoiced_amount: total.totalInvoiceAmount,
                  currency:
                    accountPayableSumary != undefined &&
                    accountPayableSumary.length > 0
                      ? accountPayableSumary[0]?.currency
                      : DEFAULT_CURRENCY,
                } as components["schemas"]["SumaryEntryDto"],
              ]}
              columns={accountPayableSumaryColumns({})}
            />
          </CardContent>
        </Card>
      </ListLayout>
    </div>
  );
}
