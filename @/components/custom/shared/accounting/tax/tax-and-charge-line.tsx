import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TypeOf, z } from "zod";
import { create } from "zustand";
import { taxAndChargeSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";
import { routes } from "~/util/route";
import FormLayout from "../../../form/FormLayout";
import { Form } from "@/components/ui/form";
import { useFetcher } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import SelectForm from "../../../select/SelectForm";
import { TaxChargeLineType, taxChargeLineTypeToJSON } from "~/gen/common";
import { useAccountLedgerDebounceFetcher } from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import FormAutocomplete from "../../../select/FormAutocomplete";
import CustomFormField from "../../../form/CustomFormField";
import { Input } from "@/components/ui/input";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { action } from "~/routes/api.taxAndChargeLine/route";
import CheckForm from "@/components/custom/input/CheckForm";
import { CustomCheckbox } from "@/components/custom/input/CustomCheckBox";

export default function TaxAndChargeLine({
  onOpenChange,
  open,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}) {
  const { t } = useTranslation("common");
  const r = routes;
  const fetcher = useFetcher<typeof action>();
  const taxAndCharge = useTaxAndCharge();
  const payload = taxAndCharge.payload;
  const [accountFetcher, onAccountChange] = useAccountLedgerDebounceFetcher({
    isGroup: false,
  });
  const form = useForm<z.infer<typeof taxAndChargeSchema>>({
    resolver: zodResolver(taxAndChargeSchema),
    defaultValues: {
      taxRate: payload?.line?.taxRate,
      type: payload?.line?.type,
      accountHeadName: payload?.line?.accountHeadName,
      accountHead: payload?.line?.accountHead,
      isDeducted: payload?.line?.isDeducted,
      amount: payload?.line?.amount,
      taxLineID: payload?.line?.taxLineID,
    },
  });
  const formValues = form.getValues();
  const onSubmit = (e: z.infer<typeof taxAndChargeSchema>) => {
    if (e.type != "FIXED_AMOUNT") {
      const amount = addOrDeductToNetAmount(
        Number(payload?.netTotal),
        Number(e.taxRate)
      );

      e.amount = amount;
    }
    // Helper function to submit the form
    const submitTaxLine = (actionType: string, taxLineData: typeof e) => {
      fetcher.submit(
        {
          action: actionType,
          taxLineData,
          docPartyID: Number(payload?.docPartyID),
        },
        {
          encType: "application/json",
          action: r.apiTaxAndChargeLine,
          method: "POST",
        }
      );
    };
    if (e.taxLineID) {
      submitTaxLine("edit-tax-line", e);
      return;
    }

    if (payload?.docPartyID) {
      submitTaxLine("add-tax-line", e);
      return;
    }

    if (payload?.onEdit) {
      payload.onEdit(e);
      onOpenChange(false);
    }
  };

  const addOrDeductToNetAmount = (
    netTotal: number,
    taxRate: number
  ): number => {
    return netTotal * (taxRate / 100);
  };

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        onOpenChange(false);
      },
    },
    [fetcher.data]
  );

  return (
    <DrawerLayout
      onOpenChange={onOpenChange}
      open={open}
      className=" max-w-2xl"
    >
      <FormLayout>
        {JSON.stringify(formValues)}
        <Form {...form}>
          <fetcher.Form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-2 pb-2"
          >
            <div className="flex flex-col ">
              {payload?.allowEdit && (
                <div className=" flex flex-wrap gap-x-3 ">
                  <Button size={"xs"}>
                    <TrashIcon size={15} />
                  </Button>
                  <Button
                    type="submit"
                    size={"xs"}
                    loading={fetcher.state == "submitting"}
                  >
                    {t("form.save")}
                  </Button>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-3 pt-3">
              <SelectForm
                control={form.control}
                label={t("form.type")}
                data={
                  [
                    {
                      name: "Sobre el Total Neto",
                      value: taxChargeLineTypeToJSON(
                        TaxChargeLineType.ON_NET_TOTAL
                      ),
                    },
                    {
                      name: "Monto fijo",
                      value: taxChargeLineTypeToJSON(
                        TaxChargeLineType.FIXED_AMOUNT
                      ),
                    },
                  ] as SelectItem[]
                }
                keyName={"name"}
                keyValue={"value"}
                name="type"
              />

              

              <FormAutocomplete
                data={accountFetcher.data?.accounts || []}
                form={form}
                label={"Cuenta Contable"}
                onValueChange={onAccountChange}
                name="accountHeadName"
                onSelect={(e) => {
                  form.setValue("accountHead", e.id);
                }}
                nameK={"name"}
              />
              <CustomFormField
                label="Tasa de impuesto"
                name="taxRate"
                control={form.control}
                children={(field) => {
                  return (
                    <Input
                      {...field}
                      disabled={formValues.type == "FIXED_AMOUNT"}
                    />
                  );
                }}
              />
              {formValues.type == "FIXED_AMOUNT" && (
                <CustomFormField
                  label="Monto"
                  name="amount"
                  control={form.control}
                  children={(field) => {
                    return <Input {...field} />;
                  }}
                />
              )}
              <CheckForm
              name="isDeducted"
              label="Deducir"
              control={form.control}
              />
            </div>
          </fetcher.Form>
        </Form>
      </FormLayout>
    </DrawerLayout>
  );
}

interface Payload {
  line?: z.infer<typeof taxAndChargeSchema>;
  currency: string;
  onEdit?: (e: z.infer<typeof taxAndChargeSchema>) => void;
  allowEdit?: boolean;
  netTotal: number;
  docPartyID?: number;
}

interface TaxAndChargeStore {
  payload?: Payload;
  open: boolean;
  onOpenChange: (e: boolean) => void;
  onOpenDialog: (opts: Payload) => void;
}

export const useTaxAndCharge = create<TaxAndChargeStore>((set) => ({
  open: false,
  onOpenChange: (e) =>
    set((state) => ({
      open: e,
    })),
  onOpenDialog: (opts) =>
    set((state) => ({
      open: true,
      payload: opts,
    })),
}));
