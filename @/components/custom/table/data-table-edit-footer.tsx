import { Button } from "@/components/ui/button"
import { Table } from "@tanstack/react-table"
import { useTranslation } from "react-i18next"

interface DataTableEditProps<TData>{
    table: Table<TData>
}

export default function DataTableEditFooter<TData>({
    table
}:DataTableEditProps<TData>){
    const {t} = useTranslation()
    const meta:any = table.options.meta
    return (
        <div className="py-2">
          <Button
           variant="outline"
           type="button"
           className="h-8"
           onClick={()=>meta?.addRow()}
           >
            {t("table.addRow")}
          </Button>
        </div>
    )
}