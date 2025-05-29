import TableCellIndex from "@/components/custom/table/cells/table-cell-index";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { loader } from "./route";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { components } from "~/sdk";
import { DEFAULT_CURRENCY } from "~/constant";
import { useMemo } from "react";

import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { route } from "~/util/route";
import { ButtonToolbar } from "~/types/actions";
import { useTranslation } from "react-i18next";
import { accountReceivableColumns } from "@/components/custom/table/columns/accounting/account-receivable-columns";
import { ResizableVirtualizedTable } from "@/components/custom/table/ResizableTable";
import AccountReportHeader from "../home.accounting.accountPayable/components/account-report-header";
import { party } from "~/util/party";
import { ListLayout } from "@/components/ui/custom/list-layout";

interface LedgerData {
  Name: string;
}

export default function AccountReceivableClient() {
  const { accountReceivable } = useLoaderData<typeof loader>();
  const r = route;
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const total = useMemo(() => {
    const totalInvoiceAmount = accountReceivable?.reduce(
      (prev, acc) => prev + acc.invoiced_amount,
      0
    );
    const totalPaidAmount = accountReceivable?.reduce(
      (prev, acc) => prev + acc.paid_amount,
      0
    );
    const totalOutstanding =
      Number(totalPaidAmount) - Number(totalInvoiceAmount);
    return {
      totalInvoiceAmount,
      totalPaidAmount,
      totalOutstanding,
    };
  }, [accountReceivable]);

  setUpToolbar(() => {
    let view: ButtonToolbar[] = [];
    view.push({
      label: t("accountReceivableSumary"),
      onClick: () => {
        navigate(
          r.toRoute({
            main: r.accountReceivableSumary,
            routePrefix: [r.accountingM],
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
      <ListLayout title="Cuentas por Cobrar">
        <Card>
          <CardHeader>
            <AccountReportHeader partyType={party.customer} />
          </CardHeader>
          <CardContent className="px-2 py-3">
            <ResizableVirtualizedTable
              data={[
                ...(accountReceivable || []),
                {
                  paid_amount: total.totalPaidAmount,
                  invoiced_amount: total.totalInvoiceAmount,
                  currency:
                    accountReceivable != undefined &&
                    accountReceivable.length > 0
                      ? accountReceivable[0]?.currency
                      : DEFAULT_CURRENCY,
                } as components["schemas"]["AccountReceivableEntryDto"],
              ]}
              columns={accountReceivableColumns({})}
            />
          </CardContent>
        </Card>
      </ListLayout>
    </div>
  );
}
