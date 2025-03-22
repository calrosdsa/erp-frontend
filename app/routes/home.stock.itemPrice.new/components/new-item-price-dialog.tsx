import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher } from "@remix-run/react";
import { create } from "zustand";
import { action } from "../route";
import { useForm } from "react-hook-form";
import { infer, z } from "zod";
import { createItemPriceSchema } from "~/util/data/schemas/stock/item-price-schema";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import ItemPriceForm from "./item-price-form";
import { route } from "~/util/route";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { GlobalState } from "~/types/app-types";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";

export const NewItemPriceDialog = ({
  open,
  onOpenChange,
  globalState,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  globalState: GlobalState;
}) => {
  const fetcher = useFetcher<typeof action>();
  const r = route;
  const form = useForm<z.infer<typeof createItemPriceSchema>>({
    resolver: zodResolver(createItemPriceSchema),
    defaultValues: {},
  });
  const { t } = useTranslation("common");

  const onSubmit = (values: z.infer<typeof createItemPriceSchema>) => {
    fetcher.submit(
      {
        action: "create-item-price",
        createItemPrice: values,
      },
      {
        encType: "application/json",
        method: "POST",
        action: r.toRoute({
          main: partyTypeToJSON(PartyType.itemPrice),
          routePrefix: [r.stockM],
          routeSufix: ["new"],
        }),
      }
    );
  };

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (fetcher.data?.itemPrice) {
          
        }
      },
    },
    [fetcher.data]
  );
  return (
    <DrawerLayout
      open={open}
      onOpenChange={onOpenChange}
      className=" max-w-2xl"
    >
      <FormLayout>
        <Form {...form}>
          <fetcher.Form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid sm:grid-cols-3 gap-3"
          >
            <ItemPriceForm
              form={form}
              globalState={globalState}
            />
            <Button
              loading={fetcher.state == "submitting"}
              className="drawer-close"
            >
              {t("form.save")}
            </Button>
          </fetcher.Form>
        </Form>
      </FormLayout>
    </DrawerLayout>
  );
};

interface NewItemPriceStore {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  onOpenDialog: (opts: {}) => void;
}
export const useNewItemPrice = create<NewItemPriceStore>((set) => ({
  open: false,
  onOpenChange: (e: boolean) => set((state) => ({ open: e })),
  onOpenDialog: (opts) => set((state) => ({ open: true })),
}));
