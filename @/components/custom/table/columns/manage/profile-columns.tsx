import { ColumnDef } from "@tanstack/react-table"
import { useTranslation } from "react-i18next"
import { components } from "~/sdk"
import TableCellText from "../../cells/table-cell-text"
import { fullName } from "~/util/convertor/convertor"
import { routes } from "~/util/route"


export const profileColumms = ({}):ColumnDef<components["schemas"]["Profile"]>[] =>{
    let columns:ColumnDef<components["schemas"]["Profile"]>[] = []
    const {t,i18n} = useTranslation("common")
    const r = routes
    columns.push({
        id:"fullName",
        header:t("form.fullName"),
        cell:({...props})=>{
            const row = props.row
            const givenName = row.original.GivenName
            const familyName = row.original.FamilyName
            const name = fullName(givenName,familyName)
            const uuid = row.original.Uuid
            return (
                <TableCellText
                {...props}
                text={name}
                navigate={()=>r.toUserProfileDetail(name,uuid)}
                />
            )}
    })
    columns.push({
        accessorKey:"GivenName",
        id:"givenName",
        header:t("form.givenName")
    })
    columns.push({
        accessorKey:"FamilyName",
        id:"familyName",
        header:t("form.familyName")
    })

    columns.push({
        accessorKey:"EmailAddress",
        id:"email"
    })
    return columns
}