import TableCellIndex from "@/components/custom/table/cells/table-cell-index";
import ResizableTable from "@/components/custom/table/ResizableTable";
import { useLoaderData } from "@remix-run/react";
import { ColumnDef } from "@tanstack/react-table";
import { loader } from "./route";
import { generalLedgerColumns } from "@/components/custom/table/columns/accounting/general-ledger-columns";
import GeneralLedgerHeader from "./components/general-ledger-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface LedgerData {
  Name: string;
}

export default function GeneralLedgerClient() {
  const { generalLedger } = useLoaderData<typeof loader>();
  return (
    <div>
      <Card>
        <CardHeader>
          <GeneralLedgerHeader />
        </CardHeader>
        <CardContent className="px-2 py-3">
          <ResizableTable
            data={
              generalLedger ||
              ([
                {
                  posting_date: "2024-05-09",
                  account: "Creditors-GH",
                  debit: "230.21 BOB",
                },
                {
                  posting_date: "2024-05-09",
                  account: "Creditors-GH",
                  debit: "230.21 BOB",
                },
              ] as any)
            }
            columns={generalLedgerColumns({})}
          />
        </CardContent>
      </Card>
    </div>
  );
}
