import { useLoaderData, useNavigate } from "@remix-run/react";
import { loader } from "./route";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/custom/table/CustomTable";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { ButtonToolbar } from "~/types/actions";
import { useTranslation } from "react-i18next";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { routes } from "~/util/route";
import { stockLedgerColumns } from "@/components/custom/table/columns/stock/stock-ledger-columns";
import StockLedgerHeader from "./components/stock-ledger-header";
import { ResizableVirtualizedTable } from "@/components/custom/table/ResizableTable";

export default function StockLedgerClient() {
  const { stockLedger } = useLoaderData<typeof loader>();
  const {t} = useTranslation("common")
  const r = routes
  const navigate = useNavigate()
  setUpToolbar(()=>{
    return {
    }
  },[])
  

  return (
    <div>
      <Card>
        <CardHeader>
          <StockLedgerHeader />
        </CardHeader>
        <CardContent className="px-2 py-3">
          <ResizableVirtualizedTable
            data={stockLedger || []}
            columns={stockLedgerColumns({})}
          />
        </CardContent>
      </Card>
    </div>
  );
}
