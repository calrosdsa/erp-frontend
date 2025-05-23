import { z } from "zod";
import { fieldNull } from "..";
import { components } from "~/sdk";


export type AccountLedgerData = z.infer<typeof accountLedgerDataSchema>

export const accountLedgerDataSchema = z.object({
    id:z.number().optional(),
    parent:fieldNull,
    account_type:z.string().nullable().optional(),
    name:z.string(),
    is_group:z.boolean(),
    ledger_no:z.string().nullable().optional(),
    account_root_type:z.string(),
    report_type:z.string().nullable().optional(),
    cash_flow_section:z.string().nullable().optional(),
    is_offset_account:z.boolean().optional(),
})

export const mapToAccountLedgerData = (e:AccountLedgerData) =>{
    const d :components["schemas"]["LedgerData"] = {
        id:e.id,
        fields: {
            account_root_type: e.account_root_type,
            account_type: e.account_type,
            cash_flow_section: e.cash_flow_section,
            is_group: e.is_group,
            is_offset_account: e.is_offset_account,
            ledger_no: e.ledger_no,
            ledger_parent: e.parent?.id,
            name: e.name,
            report_type: e.report_type,
        }
    }
    return d
}

export const editAccountLedger = z.object({
    id:z.number(),
    name:z.string(),
    isGroup:z.boolean(),
    accountType:z.string().optional(),
    accountRootType:z.string(),
    reportType:z.string().optional(),
    cashFlowSection:z.string().optional(),
    parent:z.string().optional(),
    parentID:z.number().optional(),
    ledgerNo:z.string().optional().nullable(),
})