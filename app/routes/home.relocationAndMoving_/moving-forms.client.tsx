import { DataTable } from "@/components/custom/table/CustomTable";
import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import { movingFormColumns } from "@/components/custom/table/columns/piano/moving-form-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import DataLayout from "@/components/layout/data-layout";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { Icons } from "@/components/icons";
import { Check } from "lucide-react";
import { useExporter } from "~/util/hooks/ui/useExporter";
import { ButtonToolbar } from "~/types/actions";
import { route } from "~/util/route";
import { useExporterData } from "../api.exporter/components/use-exporter-data";

export default function MovingForms() {
  const { paginationResult } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const {exportExcel} = useExporter()
  const r = route
  const exporterData = useExporterData()
 
  setUpToolbar(() => {
    let actions:ButtonToolbar[] = []
    actions.push({
      label:"Export Data",
      onClick:()=>{
        exporterData.openExporter({
          path:"/pianoForms/export",
        })
      }
    })
    return {
      actions,
    };
  }, []);

  return (
    <DataLayout
      orderOptions={[
        { name: t("table.createdAt"), value: "created_at" },
        { name: t("form.email"), value: "email" },
        { name: t("form.phoneNumber"), value: "phone_number" },
        { name: t("form.movingDate"), value: "moving_date" },
      ]}
    >
      <DataTable
        data={paginationResult?.results || []}
        paginationOptions={{
          rowCount: paginationResult?.total,
        }}
        columns={movingFormColumns({})}
      />
    </DataLayout>
  );
}
