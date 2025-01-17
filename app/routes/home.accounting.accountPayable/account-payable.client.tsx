import TableCellIndex from "@/components/custom/table/cells/table-cell-index";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { loader } from "./route";
import { generalLedgerColumns } from "@/components/custom/table/columns/accounting/general-ledger-columns";
import GeneralLedgerHeader from "./components/account-payable-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/custom/table/CustomTable";
import { components } from "~/sdk";
import { DEFAULT_CURRENCY } from "~/constant";
import { useMemo } from "react";
import AccountPayableHeader from "./components/account-payable-header";
import { accountPayableColumns } from "@/components/custom/table/columns/accounting/account-payable-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { route } from "~/util/route";
import { ButtonToolbar } from "~/types/actions";
import { useTranslation } from "react-i18next";

export default function AccountPayableClient() {
  const { accountPayable } = useLoaderData<typeof loader>();
  const r = route
  const {t} = useTranslation("common")
  const navigate = useNavigate()
  const total =  useMemo(()=>{
    const totalInvoiceAmount = accountPayable?.reduce((prev,acc)=>prev + acc.invoiced_amount,0)
    const totalPaidAmount = accountPayable?.reduce((prev,acc)=>prev + acc.paid_amount,0)
    const totalOutstanding = Number(totalPaidAmount)-Number(totalInvoiceAmount)
    return {
      totalInvoiceAmount,
      totalPaidAmount,
      totalOutstanding,
    }
  },[accountPayable])

  setUpToolbar(()=>{
    let views: ButtonToolbar[] = [];
    views.push({
      label: t("accountPayableSumary"),
      onClick: () => {
        navigate(
          r.toRoute({
            main: r.accountPayableSumary,
            routePrefix: [r.accountingM],
          })
        );
      },
    });
    return {
      view:views,
    }
  },[])

  return (
    <div>
      <Card>
        <CardHeader>
          <AccountPayableHeader />
        </CardHeader>
        <CardContent className="px-2 py-3">
          <DataTable
            data={[
              ...(accountPayable || []),
              {
                paid_amount: total.totalPaidAmount,
                invoiced_amount: total.totalInvoiceAmount,
                currency: (accountPayable != undefined && accountPayable.length > 0)
                  ? accountPayable[0]?.currency
                  : DEFAULT_CURRENCY,
              } as components["schemas"]["AccountPayableEntryDto"],
            ]}
            columns={accountPayableColumns({})}
          />
        </CardContent>
      </Card>
    </div>
  );
}
