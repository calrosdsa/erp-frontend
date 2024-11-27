import ConditionalTooltip from "@/components/custom-ui/conditional-tooltip";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DataTableEditProps<TData> {
  table: Table<TData>;
}

export default function DataTableEditFooter<TData>({
  table,
}: DataTableEditProps<TData>) {
  const { t } = useTranslation("common");
  const meta: any = table.options.meta;
  return (
    <div className="">
      {meta.addRow && (
        <Button variant={"outline"}
        size={"xs"}
        type="button"
        className="text-xs"
        onClick={()=>{
          meta?.addRow();
        }}>
          <PlusIcon/>
          <span>
          {t("table.addRow")}
          </span>
        </Button>
        // <ConditionalTooltip
        //   variant="outline"
        //   type="button"
        //   className="h-8"
        //   enableTooltip={meta.enableTooltipMessage}
        //   onClick={() => {
        //     if (!meta.enableTooltipMessage) {
        //       meta?.addRow();
        //     }
        //   }}
        //   tooltipContent={<p>{meta.tooltipMessage}</p>}
        // >
        //   {t("table.addRow")}
        // </ConditionalTooltip>
      )}
    </div>
  );
}
