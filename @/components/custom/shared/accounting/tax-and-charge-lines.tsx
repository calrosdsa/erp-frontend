import { z } from "zod";
import { taxAndChargeSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";
import { DataTable } from "../../table/CustomTable";
import { taxAndChargesColumns } from "../../table/columns/accounting/tax-and-charges-columns";
import { Typography } from "@/components/typography";
import { useTranslation } from "react-i18next";
import useTableRowActions from "~/util/hooks/useTableRowActions";
import TaxAndChargeLine, { useTaxAndCharge } from "./tax-and-charge-line";

export default function TaxAndChargesLines({
  taxLines,
  onChange,
}: {
  taxLines: z.infer<typeof taxAndChargeSchema>[];
  onChange: (e: z.infer<typeof taxAndChargeSchema>[]) => void;
}) {
  const { t } = useTranslation("common");
  const taxAndCharge = useTaxAndCharge();
  const [metaOptions] = useTableRowActions({
    onAddRow: () => {
      taxAndCharge.onOpenDialog({
        currency: "USD",
        allowEdit: true,
        onEdit: (e) => {
          const lines = [...taxLines, e];
          onChange(lines);
        },
      });
    },
  });

  return (
    <>
     
      <div className=" col-span-full">
        <Typography variant="subtitle2">Impuestos y cargos</Typography>
        <DataTable
          data={taxLines}
          columns={taxAndChargesColumns({
            currency: "USD",
          })}
          metaOptions={{
            meta: {
              ...metaOptions,
            },
          }}
        />
      </div>
    </>
  );
}
