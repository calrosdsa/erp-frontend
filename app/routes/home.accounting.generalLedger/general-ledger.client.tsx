import TableCellIndex from "@/components/custom/table/cells/table-cell-index";
import ResizableTable from "@/components/custom/table/ResizableTable";
import { useLoaderData } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { loader } from "./route";
import { generalLedgerColumns } from "@/components/custom/table/columns/accounting/general-ledger-columns";
import GeneralLedgerHeader from "./components/general-ledger-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/custom/table/CustomTable";
import { components } from "~/sdk";
import { DEFAULT_CURRENCY } from "~/constant";
import { useMemo } from "react";

interface LedgerData {
  Name: string;
}

export default function GeneralLedgerClient() {
  const { generalLedger } = useLoaderData<typeof loader>();

  const total =  useMemo(()=>{
    const totalDebit = generalLedger?.reduce((prev,acc)=>prev + acc.debit,0)
    const totalCredit = generalLedger?.reduce((prev,acc)=>prev + acc.credit,0)
    const totalBalance = Number(totalCredit)-Number(totalDebit)
    return {
      totalDebit,
      totalCredit,
      totalBalance,
    }
  },[generalLedger])
  

  return (
    <div>
      <Card>
        <CardHeader>
          <GeneralLedgerHeader />
        </CardHeader>
        <CardContent className="px-2 py-3">
          <DataTable
            data={[
              ...(generalLedger || []),
              {
                account: "Total",
                credit: total.totalCredit,
                debit: total.totalDebit,
                currency:
                  (generalLedger != undefined && generalLedger.length > 0) 
                    ? generalLedger[0]?.currency
                    : DEFAULT_CURRENCY,
                balance: total.totalBalance,
              } as components["schemas"]["GeneralLedgerEntryDto"],
            ]}
            columns={generalLedgerColumns({})}
          />
        </CardContent>
      </Card>
    </div>
  );
}
