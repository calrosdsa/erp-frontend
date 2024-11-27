import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TypeOf, z } from "zod";
import { create } from "zustand";
import { taxAndChargeSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";
import { routes } from "~/util/route";
import FormLayout from "../../form/FormLayout";
import { Form } from "@/components/ui/form";
import { useFetcher } from "@remix-run/react";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "lucide-react";
import SelectForm from "../../select/SelectForm";
import { TaxChargeLineType, taxChargeLineTypeToJSON } from "~/gen/common";
import { useAccountLedgerDebounceFetcher } from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import FormAutocomplete from "../../select/FormAutocomplete";
import CustomFormField from "../../form/CustomFormField";
import { Input } from "@/components/ui/input";

export default function TaxAndChargeLine({
  onOpenChange,
  open,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}) {
  const { t } = useTranslation("common");
  const r = routes;
  const fetcher = useFetcher();
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
    },
  });
  const onSubmit = (e: z.infer<typeof taxAndChargeSchema>) => {
    if (e.taxLineID) {
    } else {
      if (payload?.onEdit) {
        payload.onEdit(e);
      }
    }
    onOpenChange(false);
  };

  return (
    <DrawerLayout
      onOpenChange={onOpenChange}
      open={open}
      className=" max-w-2xl"
    >
      <FormLayout>
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
                  return <Input {...field} />;
                }}
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
