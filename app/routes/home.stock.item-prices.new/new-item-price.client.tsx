import CustomForm from "@/components/custom/form/CustomForm";
import FormAutocomplete from "@/components/custom/select/FormAutocomplete";
import { MultiSelect } from "@/components/custom/select/MultiSelect";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import Typography, {
  subtitle,
  title,
} from "@/components/typography/Typography";
import { useToast } from "@/components/ui/use-toast";
import { useFetcher, useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { SquareCheckIcon, SquareIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounceFetcher } from "remix-utils/use-debounce-fetcher";
import { z } from "zod";
import { GlobalState } from "~/types/app";
import { createItemPriceSchema } from "~/util/data/schemas/stock/item-price-schema";
import { useCreateTax } from "~/routes/home.accounting.taxes_/components/add-tax";
import { create } from "zustand";
import { routes } from "~/util/route";
import { DEFAULT_DEBOUNCE_TIME } from "~/constant";
import { components } from "~/sdk";
import { useItemDebounceFetcher } from "~/util/hooks/fetchers/useItemDebounceFetcher";
import { useTaxDebounceFetcher } from "~/util/hooks/fetchers/useTaxDebounceFetcher";
import { usePriceListDebounceFetcher } from "~/util/hooks/fetchers/usePriceListDebounceFetcher";
import { useCreatePriceList } from "~/routes/home.selling.stock.price-list_/components/add-price-list";
import { action, loader } from "./route";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { usePermission } from "~/util/hooks/useActions";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import CustomFormField from "@/components/custom/form/CustomFormField";
import AmountInput from "@/components/custom/input/AmountInput";
import { Input } from "@/components/ui/input";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";

export default function NewItemPriceClient({}: {}) {
  const { t } = useTranslation("common");
  const { associatedActions } = useLoaderData<typeof loader>();
  const globalState = useOutletContext<GlobalState>();
  const fetcher = useFetcher<typeof action>();
  const r = routes;
  const navigate = useNavigate()

  const [itemsDebounceFetcher, onItemNameChange] = useItemDebounceFetcher();

  const [taxesDebounceFetcher, onTaxNameChange] = useTaxDebounceFetcher();
  const [priceListDebounceFetcher, onPriceListNameChange] =
    usePriceListDebounceFetcher();
  const [taxesPermission] = usePermission({
    actions:
      associatedActions && associatedActions[partyTypeToJSON(PartyType.tax)],
    roleActions: globalState.roleActions,
  });
  const [priceListPermission] = usePermission({
    actions:
      associatedActions &&
      associatedActions[partyTypeToJSON(PartyType.priceList)],
    roleActions: globalState.roleActions,
  });
  const createTax = useCreateTax();
  const createPriceList = useCreatePriceList();
  const [selectedPriceList, setSelectedPriceList] = useState<
    components["schemas"]["PriceListDto"] | undefined
  >();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<z.infer<typeof createItemPriceSchema>>({
    resolver: zodResolver(createItemPriceSchema),
    defaultValues: {},
  });

  const onSubmit = (values: z.infer<typeof createItemPriceSchema>) => {
    fetcher.submit({
        action:"create-item-price",
        createItemPrice:values
    },{
        encType:"application/json",
        method:"POST"
    })
  };

  useDisplayMessage({
    error:fetcher.data?.error,
    success:fetcher.data?.message,
    onSuccessMessage:()=>{
        if(fetcher.data?.itemPrice){
            navigate(r.toItemPrice(fetcher.data.itemPrice.uuid))
        }
    }
  },[fetcher.data])

  setUpToolbar(() => {
    return {
      onSave: () => {
        inputRef.current?.click();
      },
    };
  }, []);

  return (
    <FormLayout>
      <Form {...form}>
        {JSON.stringify(form.formState.errors)}
        <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
          <input type="submit" className="hidden" ref={inputRef} />
          <div className="create-grid">
            <CustomFormField
              name="rate"
              label={t("form.rate")}
              form={form}
              children={(field) => {
                return <AmountInput field={field} type="number" currency="" />;
              }}
            />

            <CustomFormField
              name="itemQuantity"
              label={t("form.itemQuantity")}
              form={form}
              children={(field) => {
                return <Input {...field} type="number" />;
              }}
            />

            <FormAutocomplete
              form={form}
              data={itemsDebounceFetcher.data?.items || []}
              label={t("items")}
              nameK={"name"}
              // addNew={()=>{
              //   createTax.onOpenChange(true)
              // }}
              onSelect={(v) => {
                form.setValue("itemUuid", v.uuid);
                form.setValue("itemID", v.id);
              }}
              onValueChange={onItemNameChange}
              name="itemName"
            />

            {taxesPermission?.view && taxesPermission.create && (
              <FormAutocomplete
                form={form}
                data={taxesDebounceFetcher.data?.taxes || []}
                label={t("taxes")}
                nameK={"name"}
                addNew={()=>{
                  createTax.onOpenChange(true)
                }}
                onSelect={(v) => {
                  form.setValue("taxUuid", v.uuid);
                  form.setValue("taxID", v.id);
                }}
                onValueChange={onTaxNameChange}
                name="taxName"
              />
            )}

            {priceListPermission?.view && priceListPermission.create && (
              <FormAutocomplete
                form={form}
                data={priceListDebounceFetcher.data?.priceLists || []}
                label={t("price-list")}
                nameK={"name"}
                addNew={()=>{
                  createPriceList.onOpenChange(true)
                }}
                onSelect={(v) => {
                  setSelectedPriceList(v);
                  form.setValue("priceListUuid", v.uuid);
                  form.setValue("priceListID", v.id);
                }}
                onValueChange={onPriceListNameChange}
                name="priceListName"
              />
            )}

            {selectedPriceList != undefined && (
              <div className="col-span-full">
                <div className="flex flex-wrap gap-3">
                  <h3 className="font-semibold">
                    {t("form.currency")}: {selectedPriceList.currency}
                  </h3>
                  <div className="flex items-center gap-1">
                    {selectedPriceList.is_buying ? (
                      <SquareCheckIcon />
                    ) : (
                      <SquareIcon />
                    )}
                    <h3 className="font-medium">{t("form.buying")}</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    {selectedPriceList.is_selling ? (
                      <SquareCheckIcon />
                    ) : (
                      <SquareIcon />
                    )}
                    <h3 className="font-medium">{t("form.selling")}</h3>
                  </div>
                </div>
              </div>
            )}
          </div>
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
