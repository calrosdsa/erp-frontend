import { ColumnDef } from "@tanstack/react-table"
import { useTranslation } from "react-i18next"
import { components } from "~/sdk"
import TableCellText from "../../cells/table-cell-text"
import { fullName } from "~/util/convertor/convertor"
import { routes } from "~/util/route"


export const profileColumms = ({}):ColumnDef<components["schemas"]["ProfileDto"]>[] =>{
    let columns:ColumnDef<components["schemas"]["ProfileDto"]>[] = []
    const {t,i18n} = useTranslation("common")
    const r = routes
    columns.push({
        id:"fullName",
        header:t("form.fullName"),
        cell:({...props})=>{
            const row = props.row
            const givenName = row.original.givenName
            const familyName = row.original.familyName
            const name = fullName(givenName,familyName)
            const uuid = row.original.uuid
            return (
                <TableCellText
                {...props}
                text={name}
                navigate={()=>r.toUserProfileDetail(name,uuid)}
                />
            )}
    })
    columns.push({
        accessorKey:"givenName",
        id:"givenName",
        header:t("form.givenName")
    })
    columns.push({
        accessorKey:"familyName",
        id:"familyName",
        header:t("form.familyName")
    })

    columns.push({
        accessorKey:"partyName",
        header:t("form.type")
    })
    columns.push({
        accessorKey:"emailAddress",
        header:t("form.email"),
        id:"email"
    })
    return columns
}