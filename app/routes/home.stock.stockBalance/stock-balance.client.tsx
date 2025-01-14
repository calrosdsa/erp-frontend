import { useLoaderData, useNavigate } from "@remix-run/react";
import { loader } from "./route";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DataTable } from "@/components/custom/table/CustomTable";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { ButtonToolbar } from "~/types/actions";
import { useTranslation } from "react-i18next";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { route } from "~/util/route";
import StockLedgerHeader from "./components/stock-balance-header";
import { stockBalanceColumns } from "@/components/custom/table/columns/stock/stock-balance-columns";

interface LedgerData {
  Name: string;
}

export default function StockBalanceClient() {
  const { stockBalance } = useLoaderData<typeof loader>();
  const {t} = useTranslation("common")
  const r = route
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
          <DataTable
            data={stockBalance || []}
            columns={stockBalanceColumns({})}
          />
        </CardContent>
      </Card>
    </div>
  );
}
