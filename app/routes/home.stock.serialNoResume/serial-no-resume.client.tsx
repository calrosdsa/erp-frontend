import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import { ResizableVirtualizedTable } from "@/components/custom/table/ResizableTable";
import { serialNoSumaryColumns } from "@/components/custom/table/columns/stock/serial-no-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import StockLedgerHeader from "../home.stock.stockLedger/components/stock-ledger-header";
import SerialNumberResumeHeader from "./components/serial-no-resume-header";
import { useTranslation } from "react-i18next";

export default function SerialNoResumeClient() {
  const { serialNoSumaryEntries } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  setUpToolbar(() => {
    return {
      titleToolbar: t("f.join", { o: t("serialNo"), p: t("form.sumary") }),
    };
  });
  return (
    <div>
      <Card>
        <CardHeader>
          <SerialNumberResumeHeader />
        </CardHeader>
        <CardContent className="px-2 py-3">
          <ResizableVirtualizedTable
            data={serialNoSumaryEntries}
            columns={serialNoSumaryColumns({})}
          />
        </CardContent>
      </Card>
    </div>
  );
}
