
import { ColumnDef } from "@tanstack/react-table";
import { useTranslation } from "react-i18next";
import TableCellDate from "../../cells/table-cell-date";
import { routes } from "~/util/route";
import { components } from "~/sdk";
import TableCellNameNavigation from "../../cells/table-cell-name_navigation";
import TableCellPrice from "../../cells/table-cell-price";

export const generalLedgerColumns = ({}:{
}):ColumnDef<components["schemas"]["GeneralLedgerEntryDto"]>[] =>{

    let columns:ColumnDef<components["schemas"]["GeneralLedgerEntryDto"]>[] = [];
    const r= routes
    const {t,i18n} = useTranslation("common")
    columns.push({
        accessorKey: "posting_date",
        header:t("form.postingDate"),
        size:300,
        cell:({...props})=>{
            return (
                <TableCellDate
                i18n={i18n}
                formatDate="medium"
                {...props}                
                />
            )
        }
    });
    columns.push({
        accessorKey: "account",
        header:t("account"),
        cell:({...props})=>{
            const rowData = props.row.original
            return (
                <>
                <span className="truncate">{rowData.account}</span>
                </>
            )
        }
    });
    columns.push({
        accessorKey: "debit",
        cell:({...props})=>{
            const rowData = props.row.original
            return <TableCellPrice
            i18n={i18n}
            currency={rowData.currency}
            {...props}
            />
        }
    });
    columns.push({
        accessorKey: "credit",
        cell:({...props})=>{
            const rowData = props.row.original
            return <TableCellPrice
            i18n={i18n}
            currency={rowData.currency}
            {...props}
            />
        }
    });
    columns.push({
        accessorKey: "balance",
        cell:({...props})=>{
            const rowData = props.row.original
            return <TableCellPrice
            i18n={i18n}
            currency={rowData.currency}
            {...props}
            />
        }
    });
    columns.push({
        accessorKey: "voucher_type",
    });

    columns.push({
        accessorKey: "voucher_subtype",
    });
    columns.push({
        accessorKey: "voucher_no",
    });

    columns.push({
        accessorKey: "against_account",
    });

    columns.push({
        accessorKey: "party_type",
    });

    columns.push({
        accessorKey: "party_name",
    });

    columns.push({
        accessorKey: "against_voucher_type",
    });

    columns.push({
        accessorKey: "against_voucher",
    });

    return [
        ...columns
    ]
}
