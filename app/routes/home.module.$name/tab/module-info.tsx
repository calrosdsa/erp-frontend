import { useLoaderData } from "@remix-run/react"
import { loader } from "../route"
import { DataTable } from "@/components/custom/table/CustomTable"
import { moduleSectionColumns } from "@/components/custom/table/columns/core/module-columns"


export default function ModuleInfo(){
    const {module,sections} = useLoaderData<typeof  loader>()


    return (
        <div>
            {/* <DataTable
            columns={moduleSectionColumns({})}
            data={sections || []}
            /> */}
        </div>
    )
}