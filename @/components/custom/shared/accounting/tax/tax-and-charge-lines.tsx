import { z } from "zod";
import {
  taxAndChargeSchema,
  toTaxAndChargeLineSchema,
} from "~/util/data/schemas/accounting/tax-and-charge-schema";
import { DataTable } from "../../../table/CustomTable";
import { taxAndChargesColumns } from "../../../table/columns/accounting/tax-and-charges-columns";
import { Typography } from "@/components/typography";
import { useTranslation } from "react-i18next";
import useTableRowActions from "~/util/hooks/useTableRowActions";
import { useTaxAndCharge } from "./tax-and-charge-line";
import DisplayTextValue from "../../../display/DisplayTextValue";
import { formatCurrencyAmount } from "~/util/format/formatCurrency";
import { useTaxAndCharges } from "./use-tax-charges";
import { useLineItems } from "../../item/use-line-items";
import { Separator } from "@/components/ui/separator";
import { ChargesTemplateForm } from "~/util/hooks/fetchers/accounting/useChargesTemplateFetcher";
import { UseFormReturn } from "react-hook-form";
import { useFetcher } from "@remix-run/react";
import { action } from "~/routes/api.taxAndChargeLine/route";
import { routes } from "~/util/route";
import { useEffect } from "react";

export default function TaxAndChargesLines({
  onChange,
  currency,
  docPartyID,
  allowEdit = true,
  showTotal = true,
  allowCreate = true,
  form,
  docPartyType,
}: {
  onChange?: (e: z.infer<typeof taxAndChargeSchema>[]) => void;
  currency: string;
  allowEdit?: boolean;
  allowCreate?: boolean;
  docPartyID?: number;
  docPartyType?: string;
  showTotal?: boolean;
  form?: UseFormReturn<any, any, undefined>;
}) {
  const { t, i18n } = useTranslation("common");
  const taxAndCharge = useTaxAndCharge();
  const r = routes;
  const fetcher = useFetcher<typeof action>();
  const {
    lines: taxLines,
    totalAdded,
    totalDeducted,
    total,
    updateFromItems,
  } = useTaxAndCharges();
  const shared = {
    currency: currency,
    allowEdit: allowEdit,
    docPartyID: docPartyID,
    docPartyType:docPartyType,
  };
  const [metaOptions] = useTableRowActions({
    ...(allowCreate && {
      onAddRow: () => {
        taxAndCharge.onOpenDialog({
          ...shared,
          idx:taxLines.length,
          onEdit: (e) => {
            const lines = [...taxLines, e];
            if (onChange) {
              onChange(lines);
            }
          },
        });
      },
    }),
    onEdit: (rowIndex) => {
      const f = taxLines.find((t, idx) => idx == rowIndex);
      if (f) {
        taxAndCharge.onOpenDialog({
          ...shared,
          line: f,
          idx:rowIndex,
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
          onDelete: () => {
            const f = taxLines.filter((t, idx) => idx != rowIndex);
            if (onChange) {
              onChange(f);
            }
          },
        });
      }
    },
    ...(onChange && {
      onDelete: (rowIndex) => {
        const f = taxLines.filter((t, idx) => idx != rowIndex);
        if (onChange) {
          onChange(f);
        }
      },
    }),
  });

  useEffect(() => {
    if (fetcher.data && fetcher.data?.taxAndChargesLines.length > 0) {
      form?.setValue(
        "taxLines",
        fetcher.data?.taxAndChargesLines.map((t) =>
          toTaxAndChargeLineSchema(t, {
            ignoreID: true,
          })
        )
      );
      form?.trigger("taxLines");
    }
  }, [fetcher.data]);

  return (
    <>
      <Separator className=" col-span-full" />
      <Typography variant="subtitle2" className=" col-span-full">
        Impuestos y cargos
      </Typography>
      {form && (
        <ChargesTemplateForm
          control={form?.control}
          label={t("chargesTemplate")}
          onSelect={(e) => {
            fetcher.submit(
              {
                action: "tax-and-charge-lines",
                docPartyID: e.id,
              },
              {
                action: r.apiTaxAndChargeLine,
                method: "POST",
                encType: "application/json",
              }
            );
          }}
          allowEdit={allowEdit}
        />
      )}

      <div className=" col-span-full">
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

      {showTotal && (
        <>
          <DisplayTextValue
            title="Impuestos y cargos añadidos"
            value={formatCurrencyAmount(totalAdded, currency, i18n.language)}
          />
          <DisplayTextValue
            title="Impuestos y cargos deducidos"
            value={formatCurrencyAmount(totalDeducted, currency, i18n.language)}
          />
          <DisplayTextValue
            title="Total de impuestos y cargos"
            value={formatCurrencyAmount(total, currency, i18n.language)}
          />
        </>
      )}
    </>
  );
}
