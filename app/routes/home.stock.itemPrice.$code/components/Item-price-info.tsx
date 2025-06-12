import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { action, loader } from "../route";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { useEffect, useRef } from "react";
import { editItemPriceSchema } from "~/util/data/schemas/stock/item-price-schema";
import { z } from "zod";
import { useEditFields } from "~/util/hooks/useEditFields";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
  useSetupToolbarStore,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";
import { Separator } from "@/components/ui/separator";
import { ItemAutocompleteForm } from "~/util/hooks/fetchers/useItemDebounceFetcher";
import { UomAutocompleteForm } from "~/util/hooks/fetchers/use-uom-fetcher";
import { Typography } from "@/components/typography";
import { Form } from "@/components/ui/form";
import { formatAmount } from "~/util/format/formatCurrency";
import { PriceListAutocompleteForm } from "~/util/hooks/fetchers/use-pricelist-fetcher";

type EditData = z.infer<typeof editItemPriceSchema>;
export default function ItemPriceInfo() {
  const { itemPrice, actions, associatedActions } =
    useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const [currencyExchangePerm] = usePermission({ actions, roleActions });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const { form, hasChanged, updateRef } = useEditFields<EditData>({
    schema: editItemPriceSchema,
    defaultValues: {
      id: itemPrice?.id,
      rate: formatAmount(itemPrice?.rate),
      item: itemPrice?.item_name,
      itemID: itemPrice?.item_id,
      itemQuantity: itemPrice?.item_quantity,
      priceList: itemPrice?.price_list_name,
      priceListID: itemPrice?.price_list_id,
      uom: itemPrice?.item_uom,
      uomID: itemPrice?.item_uom_id,
    },
  });
  const {setRegister} = useSetupToolbarStore()
  const allowEdit = currencyExchangePerm?.edit || false;

  const onSubmit = (e: EditData) => {
    fetcher.submit(
      {
        action: "edit",
        editData: e,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
  };
  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );

  useEffect(()=>{
    setRegister("tab",{
      onSave: () => inputRef.current?.click(),
      disabledSave: !hasChanged,
    })
  },[hasChanged])

 

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        updateRef(form.getValues());
      },
    },
    [fetcher.data]
  );

  return (
    <FormLayout>
      <Form {...form}>
        {/* {JSON.stringify(form.getValues())} */}
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="detail-grid">
            <CustomFormFieldInput
              name="rate"
              required={true}
              label={t("form.rate")}
              control={form.control}
              allowEdit={allowEdit}
              inputType="input"
            />

            <CustomFormFieldInput
              name="itemQuantity"
              label={t("form.itemQuantity")}
              required={true}
              control={form.control}
              inputType="input"
              allowEdit={allowEdit}
            />
            <Separator className=" col-span-full" />
            <Typography variant="title2" className=" col-span-full">
              {t("item")}
            </Typography>

            <ItemAutocompleteForm
              control={form.control}
              label={t("item")}
              required={true}
              allowEdit={allowEdit}
              onSelect={(e) => {
                form.setValue("itemID", e.id);
                // form.setValue("uom", e.uom);
                // form.setValue("uomID", e.uom_id);
              }}
            />
            <UomAutocompleteForm
              control={form.control}
              allowEdit={allowEdit}
              label={t("form.uom")}
              onSelect={(e) => {
                form.setValue("uomID", e.id);
              }}
            />

            <Separator className=" col-span-full" />
            <Typography variant="title2" className=" col-span-full">
              {t("priceList")}
            </Typography>
            <PriceListAutocompleteForm
              control={form.control}
              label={t("priceList")}
              required={true}
              onSelect={(e) => {
                form.setValue("priceListID", e.id);
              }}
            />
          </div>
          <input className="hidden" type="submit" ref={inputRef} />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
