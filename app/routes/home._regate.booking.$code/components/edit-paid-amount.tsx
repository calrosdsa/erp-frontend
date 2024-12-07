import FormLayout from "@/components/custom/form/FormLayout";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { create } from "zustand";
import { components } from "~/sdk";
import { editPaidAmountSchema } from "~/util/data/schemas/regate/booking-schema";
import { action } from "../route";
import CustomFormField from "@/components/custom/form/CustomFormField";
import AmountInput from "@/components/custom/input/AmountInput";
import { Button } from "@/components/ui/button";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { Card, CardContent } from "@/components/ui/card";
import {
  formatAmount,
  formatCurrency,
  formatCurrencyAmount,
} from "~/util/format/formatCurrency";
import { DEFAULT_CURRENCY } from "~/constant";

export const EditPaidAmount = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}) => {
  const { t, i18n } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const editPaidAmount = useEditPaidAmount();
  const { booking } = editPaidAmount;
  const form = useForm<z.infer<typeof editPaidAmountSchema>>({
    resolver: zodResolver(editPaidAmountSchema),
    defaultValues: {
      bookingID: booking?.id,
      paidAmount: formatAmount(booking?.paid),
      totalPrice: formatAmount(booking?.total_price),
    },
  });
  const onSubmit = (values: z.infer<typeof editPaidAmountSchema>) => {
    // console.log(values);
    fetcher.submit(
      {
        editPaidAmount: values,
        action: "edit-paid-amount",
      },
      {
        encType: "application/json",
        method: "POST",
      }
    );
  };

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onShowMessage: () => editPaidAmount.onOpenChange(false),
    },
    [fetcher.data]
  );
  return (
    <DrawerLayout open={open} onOpenChange={onOpenChange} title="Agregar pago">
      <FormLayout>
        <Form {...form}>
          <Card>
            <CardContent className="py-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Precio Total
                  </p>
                  <p className="text-lg font-semibold">
                    {formatCurrency(
                      booking?.total_price,
                      DEFAULT_CURRENCY,
                      i18n.language
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Monto Pagado
                  </p>
                  <p className="text-lg font-semibold">
                    {formatCurrencyAmount(
                      form.getValues()?.paidAmount,
                      DEFAULT_CURRENCY,
                      i18n.language
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <fetcher.Form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" grid pt-2"
          >
            <CustomFormField
              form={form}
              label="Monto"
              description="Este monto se sumará al monto ya pagado."
              name="addedAmount"
              children={(field) => {
                return (
                  <AmountInput
                    field={field}
                    onChange={(e) => {
                      const n = Number(e.target.value);
                      const t = Number(booking?.paid) / 100 + n;
                      field.onChange(e.target.value);
                      form.setValue("paidAmount", t);
                      form.trigger("paidAmount");
                    }}
                  />
                );
              }}
            />
            <Button
              type="submit"
              className="drawer-close"
              loading={fetcher.state == "submitting"}
            >
              {t("form.save")}
            </Button>
          </fetcher.Form>
        </Form>
      </FormLayout>
    </DrawerLayout>
  );
};

interface EditPaidAmount {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  onOpenDialog: (opts: {
    booking?: components["schemas"]["BookingDto"];
  }) => void;
  booking?: components["schemas"]["BookingDto"];
}

export const useEditPaidAmount = create<EditPaidAmount>((set) => ({
  open: false,
  booking: undefined,
  onOpenChange: (e) =>
    set((state) => ({
      open: e,
    })),
  onOpenDialog: (opts) =>
    set((state) => ({
      booking: opts.booking,
      open: true,
    })),
}));
