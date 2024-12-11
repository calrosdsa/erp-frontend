import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useFetcher } from "@remix-run/react";
import { create } from "zustand";

import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import SelectForm from "../../../select/SelectForm";
import FormAutocomplete from "../../../select/FormAutocomplete";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";

import { useAccountLedgerDebounceFetcher } from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { useConfirmationDialog } from "@/components/layout/drawer/ConfirmationDialog";
import { useTotal } from "../../document/use-total";

import {
  taxAndChargeSchema,
  mapToTaxAndChargeData,
} from "~/util/data/schemas/accounting/tax-and-charge-schema";
import { routes } from "~/util/route";
import { TaxChargeLineType, taxChargeLineTypeToJSON } from "~/gen/common";
import { components } from "~/sdk";
import { action } from "~/routes/api.taxAndChargeLine/route";

interface TaxAndChargeLineProps {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  payload: Payload;
}

interface Payload {
  line?: z.infer<typeof taxAndChargeSchema>;
  currency: string;
  onEdit?: (data: z.infer<typeof taxAndChargeSchema>) => void;
  onDelete?: () => void;
  allowEdit?: boolean;
  docPartyID?: number;
  docPartyType?: string;
  idx: number;
}

const useTaxAndChargeStore = create<{
  payload?: Payload;
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onOpenDialog: (opts: Payload) => void;
}>((set) => ({
  open: false,
  onOpenChange: (isOpen) => set({ open: isOpen }),
  onOpenDialog: (opts) => set({ open: true, payload: opts }),
}));

function TaxTypeSelect({
  control,
  allowEdit,
  onTrigger,
}: {
  control: any;
  allowEdit?: boolean;
  onTrigger: () => void;
}) {
  const { t } = useTranslation("common");

  const taxTypes = [
    {
      name: "Sobre el Total Neto",
      value: taxChargeLineTypeToJSON(TaxChargeLineType.ON_NET_TOTAL),
    },
    {
      name: "Monto fijo",
      value: taxChargeLineTypeToJSON(TaxChargeLineType.FIXED_AMOUNT),
    },
    {
      name: "Sobre el total de la fila anterior",
      value: taxChargeLineTypeToJSON(TaxChargeLineType.ON_PREVIOUS_ROW_TOTAL),
    },
    {
      name: "Sobre el monto de la fila anterior",
      value: taxChargeLineTypeToJSON(TaxChargeLineType.ON_PREVIOUS_ROW_AMOUNT),
    },
  ];

  return (
    <SelectForm
      control={control}
      label={t("form.type")}
      data={taxTypes}
      allowEdit={allowEdit}
      keyName="name"
      keyValue="value"
      onValueChange={() => onTrigger()}
      name="type"
    />
  );
}

function AccountSelect({
  form,
  allowEdit,
}: {
  form: any;
  allowEdit?: boolean;
}) {
  const [accountFetcher, onAccountChange] = useAccountLedgerDebounceFetcher({
    isGroup: false,
  });

  return (
    <FormAutocomplete
      data={accountFetcher.data?.accounts || []}
      form={form}
      allowEdit={allowEdit}
      label="Cuenta Contable"
      onValueChange={onAccountChange}
      name="accountHeadName"
      onSelect={(e) => form.setValue("accountHead", e.id)}
      nameK="name"
    />
  );
}

export default function TaxAndChargeLine({
  open,
  onOpenChange,
  payload,
}: TaxAndChargeLineProps) {
  const { t } = useTranslation("common");
  const r = routes;
  const fetcher = useFetcher<typeof action>();
  const {
    onEditTaxLine,
    onAddTaxLine,
    onDeleteTaxLine,
    totalItemAmount,
    calculateChargeLineAmount,
  } = useTotal();
  const confirmationDialog = useConfirmationDialog();

  const form = useForm<z.infer<typeof taxAndChargeSchema>>({
    resolver: zodResolver(taxAndChargeSchema),
    defaultValues: {
      taxRate: payload?.line?.taxRate,
      type: payload?.line?.type,
      accountHeadName: payload?.line?.accountHeadName,
      accountHead: payload?.line?.accountHead,
      isDeducted: payload?.line?.isDeducted ?? false,
      amount: payload?.line?.amount,
      taxLineID: payload?.line?.taxLineID,
    },
  });

  const formValues = form.getValues();

  const submitTaxLine = (
    actionType: "edit-tax-line" | "add-tax-line",
    taxLineData: z.infer<typeof taxAndChargeSchema>
  ) => {
    const mappedData = mapToTaxAndChargeData(taxLineData);
    const baseBody = {
      doc_party_id: payload?.docPartyID ?? 0,
      doc_party_type: payload?.docPartyType ?? "",
      total_amount:
        actionType === "edit-tax-line"
          ? onEditTaxLine(taxLineData)
          : onAddTaxLine(taxLineData),
      ...mappedData,
    };

    const submitData =
      actionType === "edit-tax-line"
        ? { id: taxLineData.taxLineID ?? 0, ...baseBody }
        : baseBody;

    fetcher.submit(
      {
        action: actionType,
        [actionType === "edit-tax-line" ? "editData" : "addData"]: submitData,
      },
      {
        encType: "application/json",
        action: r.apiTaxAndChargeLine,
        method: "POST",
      }
    );
  };

  const onSubmit = (data: z.infer<typeof taxAndChargeSchema>) => {
    if (data.taxLineID) {
      submitTaxLine("edit-tax-line", data);
    } else if (payload?.docPartyID) {
      submitTaxLine("add-tax-line", data);
    } else if (payload?.onEdit) {
      payload.onEdit(data);
      onOpenChange(false);
    }
  };

  const deleteTaxLine = () => {
    if (formValues.taxLineID) {
      const body: components["schemas"]["DeleteTaxLineRequestBody"] = {
        id: formValues.taxLineID,
        doc_party_id: payload?.docPartyID ?? 0,
        doc_party_type: payload?.docPartyType ?? "",
        total_amount: onDeleteTaxLine(formValues),
      };
      confirmationDialog.onOpenDialog({
        onConfirm: () => {
          fetcher.submit(
            { action: "delete-tax-line", deleteData: body },
            {
              encType: "application/json",
              action: r.apiTaxAndChargeLine,
              method: "POST",
            }
          );
        },
        title: "Eliminar línea de impuestos y cargos",
      });
    } else if (payload?.onDelete) {
      payload.onDelete();
      onOpenChange(false);
    }
  };

  useEffect(() => {
    if (payload.allowEdit) {
      if (formValues.type && formValues.taxRate) {
        const [amount, alertMessage] = calculateChargeLineAmount(
          formValues.type,
          formValues.taxRate,
          payload.idx
        );
        if (alertMessage != "") {
          form.setError("type", { message: alertMessage });
        } else {
          form.setValue("amount", amount);
        }
        console.log("CALCULATE AMOUNT BASE ON TAX RATE");
      }
    }
  }, [formValues.type, formValues.taxRate]);

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => onOpenChange(false),
    },
    [fetcher.data]
  );

  return (
    <DrawerLayout onOpenChange={onOpenChange} open={open} className="max-w-2xl">
      <Form {...form}>
        {/* {JSON.stringify(form.getValues())} */}
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-2 pb-2"
        >
          {payload?.allowEdit && (
            <div className="flex flex-wrap gap-x-3 mb-4">
              {payload.onDelete && (
                <Button size="xs" type="button" onClick={deleteTaxLine}>
                  <TrashIcon size={15} />
                </Button>
              )}
              <Button
                type="submit"
                size="xs"
                loading={fetcher.state === "submitting"}
              >
                {t("form.save")}
              </Button>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-3">
            <TaxTypeSelect
              control={form.control}
              allowEdit={payload?.allowEdit}
              onTrigger={() => {
                form.trigger("type");
              }}
            />
            <AccountSelect form={form} allowEdit={payload?.allowEdit} />
            <CustomFormFieldInput
              label="Tasa de impuesto"
              name="taxRate"
              control={form.control}
              inputType="input"
              onBlur={() => {
                form.trigger("taxRate");
              }}
              allowEdit={payload.allowEdit}
            />

            <CustomFormFieldInput
              label="Monto"
              name="amount"
              control={form.control}
              inputType="input"
              allowEdit={
                payload.allowEdit &&
                formValues.type ==
                  taxChargeLineTypeToJSON(TaxChargeLineType.FIXED_AMOUNT)
              }
            />
            {/* <AmountInput
              control={form.control}
              allowEdit={payload?.allowEdit}
              type={formValues.type}
            /> */}
            <CustomFormFieldInput
              name="isDeducted"
              label="Deducir"
              control={form.control}
              inputType="check"
              allowEdit={payload?.allowEdit}
            />
          </div>
        </fetcher.Form>
      </Form>
    </DrawerLayout>
  );
}

export const useTaxAndCharge = useTaxAndChargeStore;
