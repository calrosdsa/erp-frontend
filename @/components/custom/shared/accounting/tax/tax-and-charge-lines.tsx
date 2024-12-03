import { z } from "zod";
import { taxAndChargeSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";
import { DataTable } from "../../../table/CustomTable";
import { taxAndChargesColumns } from "../../../table/columns/accounting/tax-and-charges-columns";
import { Typography } from "@/components/typography";
import { useTranslation } from "react-i18next";
import useTableRowActions from "~/util/hooks/useTableRowActions";
import TaxAndChargeLine, { useTaxAndCharge } from "./tax-and-charge-line";
import DisplayTextValue from "../../../display/DisplayTextValue";
import { formatCurrencyAmount } from "~/util/format/formatCurrency";
import { useTaxAndCharges } from "./use-tax-charges";
import { useLineItems } from "../../item/use-line-items";
import { Separator } from "@/components/ui/separator";

export default function TaxAndChargesLines({
  onChange,
  currency,
  docPartyID,
  allowEdit,
}: {
  onChange?: (e: z.infer<typeof taxAndChargeSchema>[]) => void;
  currency: string;
  allowEdit?: boolean;
  docPartyID?: number;
}) {
  const { t, i18n } = useTranslation("common");
  const taxAndCharge = useTaxAndCharge();
  const {
    lines: taxLines,
    totalAdded,
    totalDeducted,
    total,
  } = useTaxAndCharges();
  const { total: netTotal } = useLineItems();
  const shared = {
    currency: currency,
    allowEdit: allowEdit || true,
    netTotal: netTotal,
    docPartyID: docPartyID,
  };
  const [metaOptions] = useTableRowActions({
    onAddRow: () => {
      taxAndCharge.onOpenDialog({
        ...shared,
        onEdit: (e) => {
          const lines = [...taxLines, e];
          if (onChange) {
            onChange(lines);
          }
        },
      });
    },
    onEdit: (rowIndex) => {
      const f = taxLines.find((t, idx) => idx == rowIndex);
      if (f) {
        taxAndCharge.onOpenDialog({
          ...shared,
          line: f,
          onEdit: (e) => {
            const lines = taxLines.map((t, idx) => {
              if (idx == rowIndex) {
                t = e;
              }
              return t;
            });
            if (onChange) {
              onChange(lines);
            }
          },
        });
      }
    },
    onDelete:(rowIndex)=>{
      const f = taxLines.filter((t, idx) => idx != rowIndex);
      if (onChange) {
        onChange(f);
      }
    }
  });

  return (
    <>
    <Separator className=" col-span-full"/>   
      <div className=" col-span-full">
        <Typography variant="subtitle2">Impuestos y cargos</Typography>
        {/* {JSON.stringify(taxLines)} */}
        <DataTable
          data={taxLines}
          columns={taxAndChargesColumns({
            currency: currency,
          })}
          metaOptions={{
            meta: {
              ...metaOptions,
            },
          }}
        />
      </div>

      <DisplayTextValue
      title="Impuestos y cargos añadidos"
      value={formatCurrencyAmount(totalAdded,currency,i18n.language)}
      />
       <DisplayTextValue
      title="Impuestos y cargos deducidos"
      value={formatCurrencyAmount(totalDeducted,currency,i18n.language)}
      />
       <DisplayTextValue
      title="Total de impuestos y cargos"
      value={formatCurrencyAmount(total,currency,i18n.language)}
      />
    </>
  );
}
