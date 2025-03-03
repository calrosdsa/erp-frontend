import TableCellIndex from "@/components/custom/table/cells/table-cell-index";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { loader } from "./route";
import { generalLedgerColumns } from "@/components/custom/table/columns/accounting/general-ledger-columns";
import GeneralLedgerHeader from "./components/account-receivable-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/custom/table/CustomTable";
import { components } from "~/sdk";
import { DEFAULT_CURRENCY } from "~/constant";
import { useMemo } from "react";
import { accountPayableColumns } from "@/components/custom/table/columns/accounting/account-payable-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { route } from "~/util/route";
import { ButtonToolbar } from "~/types/actions";
import { useTranslation } from "react-i18next";
import AccountReceivableHeader from "./components/account-receivable-header";
import { accountReceivableColumns } from "@/components/custom/table/columns/accounting/account-receivable-columns";
import { ResizableVirtualizedTable } from "@/components/custom/table/ResizableTable";

interface LedgerData {
  Name: string;
}

export default function AccountReceivableClient() {
  const { accountReceivable } = useLoaderData<typeof loader>();
  const r = route
  const {t} = useTranslation("common")
  const navigate = useNavigate()
  const total =  useMemo(()=>{
    const totalInvoiceAmount = accountReceivable?.reduce((prev,acc)=>prev + acc.invoiced_amount,0)
    const totalPaidAmount = accountReceivable?.reduce((prev,acc)=>prev + acc.paid_amount,0)
    const totalOutstanding = Number(totalPaidAmount)-Number(totalInvoiceAmount)
    return {
      totalInvoiceAmount,
      totalPaidAmount,
      totalOutstanding,
    }
  },[accountReceivable])

  setUpToolbar(()=>{
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
      view:view,
    }
  },[])

  return (
    <div>
      <Card>
        <CardHeader>
          <AccountReceivableHeader />
        </CardHeader>
        <CardContent className="px-2 py-3">
          <ResizableVirtualizedTable
            data={[
              ...(accountReceivable || []),
              {
                paid_amount: total.totalPaidAmount,
                invoiced_amount: total.totalInvoiceAmount,
                currency: (accountReceivable != undefined && accountReceivable.length > 0)
                  ? accountReceivable[0]?.currency
                  : DEFAULT_CURRENCY,
              } as components["schemas"]["AccountReceivableEntryDto"],
            ]}
            columns={accountReceivableColumns({})}
          />
        </CardContent>
      </Card>
    </div>
  );
}
