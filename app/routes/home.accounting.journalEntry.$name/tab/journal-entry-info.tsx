import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { loader } from "../route";
import { Typography } from "@/components/typography";
import { journalEntryLineColumns } from "@/components/custom/table/columns/accounting/journal-entry-columns";
import { mapToJournalEntryLineSchama } from "~/util/data/schemas/accounting/journal-entry-schema";
import { useMemo } from "react";
import { DataTable } from "@/components/custom/table/CustomTable";

export default function JournalEntryInfo() {
  const { t } = useTranslation("common");
  const { journalEntry,lines } = useLoaderData<typeof loader>();
  const entryLines = useMemo(()=>{
    return lines.map(t=>mapToJournalEntryLineSchama(t))
  },[lines])
  return (
    <div className="detail-grid">
      <DisplayTextValue
        title={t("form.type")}
        value={t(journalEntry?.entry_type || "")}
      />

      <div className="col-span-full">
        <Typography variant="subtitle2">{t("form.entries")}</Typography>
        <DataTable
          data={entryLines}
          columns={journalEntryLineColumns()}
          metaOptions={{
            meta: {
              enableTooltipMessage: false,
            },
          }}
        />
      </div>
    </div>
  );
}
