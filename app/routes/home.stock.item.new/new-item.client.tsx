import React, { useRef, useState } from "react";
import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/typography";
import CustomFormFieldInput from "@/components/custom/form/CustomFormInput";

import { action, loader } from "./route";
import {
  createItemSchema,
  itemPriceLine,
} from "~/util/data/schemas/stock/item-schemas";
import { UomAutocompleteForm } from "~/util/hooks/fetchers/useUomDebounceFetcher";
import { GroupAutocompleteForm } from "~/util/hooks/fetchers/useGroupDebounceFetcher";
import { PriceListAutocompleteForm } from "~/util/hooks/fetchers/usePriceListDebounceFetcher";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { route } from "~/util/route";
import { GlobalState } from "~/types/app";
import { PartyType, partyTypeToJSON } from "~/gen/common";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import FormLayout from "@/components/custom/form/FormLayout";
import Editor from "@/components/custom-ui/rich-text/editor";
import Viewer from "@/components/custom-ui/rich-text/viewer";
import RichTextEditor from "@/components/custom-ui/rich-text/editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NewItemClient() {
  const fetcher = useFetcher<typeof action>();
  const { entityActions } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const { roleActions } = useOutletContext<GlobalState>();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const r = route;
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof createItemSchema>>({
    resolver: zodResolver(createItemSchema),
    defaultValues: {
      maintainStock:false,
      itemPriceLines: [],
    },
  });
  const formValues = form.getValues();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itemPriceLines",
  });

  function onSubmit(values: z.infer<typeof createItemSchema>) {
    fetcher.submit(
      {
        action: "create-item",
        createItem: values,
      },
      {
        action: r.toRoute({
          main: partyTypeToJSON(PartyType.item),
          routePrefix: [r.stockM],
          routeSufix: ["new"],
        }),
        method: "POST",
        encType: "application/json",
      }
    );
  }

  setUpToolbar(() => {
    return {
      title: t("new"),
      onSave: () => {
        inputRef.current?.click();
      },
    };
  }, []);

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (fetcher.data?.item) {
          const newItem = fetcher.data.item;
          navigate(
            r.toRoute({
              main: partyTypeToJSON(PartyType.item),
              routePrefix: [r.stockM],
              routeSufix: [newItem.name],
              q: {
                tab: "info",
                id: newItem.code,
              },
            })
          );
        }
      },
    },
    [fetcher.data]
  );

  return (
    <Card>
      <FormLayout className=" p-3">
        <Form {...form}>
          {/* {JSON.stringify(form.formState.errors)} */}
          <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="item">
              <TabsList>
                <TabsTrigger value="item">Item</TabsTrigger>
                <TabsTrigger value="inventory">Inventario</TabsTrigger>
              </TabsList>
              <TabsContent value="item">
                <div className="create-grid">
                  <CustomFormFieldInput
                    control={form.control}
                    name="name"
                    required={true}
                    label={"Nombre"}
                    inputType="input"
                  />
                  <CustomFormFieldInput
                    control={form.control}
                    name="code"
                    required={true}
                    label={"Código / NP"}
                    inputType="input"
                  />
                  <UomAutocompleteForm
                    control={form.control}
                    required={true}
                    label={t("form.uom")}
                    name="uomName"
                    onSelect={(e) => {
                      form.setValue("uomID", e.id);
                    }}
                  />
                  <GroupAutocompleteForm
                    control={form.control}
                    label={t("group")}
                    name="groupName"
                    required={true}
                    roleActions={roleActions}
                    isGroup={false}
                    partyType={r.itemGroup}
                    onSelect={(e) => {
                      form.setValue("groupID", e.id);
                    }}
                  />
                  <CustomFormFieldInput
                    control={form.control}
                    name="maintainStock"
                    label={"Mantener en Stock"}
                    inputType="check"
                    allowEdit={true}
                  />

                  <CustomFormFieldInput
                    className=" col-span-full"
                    control={form.control}
                    name="description"
                    required={false}
                    label={t("form.description")}
                    inputType="richtext"
                    allowEdit={true}
                  />

                  <Typography
                    variant="subtitle2"
                    className="col-span-full mt-4"
                  >
                    {t("itemPrice")}
                  </Typography>

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="col-span-full grid lg:grid-cols-6 gap-4  overflow-auto w-full px-1 items-end border-b pb-1"
                    >
                      <CustomFormFieldInput
                        control={form.control}
                        name={`itemPriceLines.${index}.rate`}
                        label={t("form.rate")}
                        inputType="input"
                        type="number"
                      />
                      <CustomFormFieldInput
                        control={form.control}
                        name={`itemPriceLines.${index}.itemQuantity`}
                        label={t("form.quantity")}
                        inputType="input"
                        type="number"
                      />
                      <PriceListAutocompleteForm
                        control={form.control}
                        label={t("priceList")}
                        name={`itemPriceLines.${index}.priceList`}
                        onSelect={(e) => {
                          form.setValue(
                            `itemPriceLines.${index}.priceListID`,
                            e.id
                          );
                        }}
                      />
                      <UomAutocompleteForm
                        control={form.control}
                        label={t("form.uom")}
                        name={`itemPriceLines.${index}.uom`}
                        onSelect={(e) => {
                          form.setValue(`itemPriceLines.${index}.uomID`, e.id);
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        variant={"ghost"}
                      >
                        <TrashIcon />
                        <span>Remover</span>
                      </Button>
                    </div>
                  ))}
                  <div className=" col-span-full">
                    <Button
                      type="button"
                      onClick={() =>
                        append({
                          rate: 0,
                          itemQuantity: 1,
                          priceList: "",
                          priceListID: 0,
                          uom: formValues.uomName,
                          uomID: formValues.uomID,
                        })
                      }
                      className="col-span-full mt-2 w-min"
                      variant={"ghost"}
                    >
                      <PlusIcon />
                      <span>Agregar Precio</span>
                    </Button>
                  </div>

                  <input ref={inputRef} type="submit" className="hidden" />
                </div>
              </TabsContent>
              <TabsContent value="inventory">
                <div className=" create-grid">
                  <CustomFormFieldInput
                    control={form.control}
                    name="itemInventory.shelfLifeInDays"
                    label={"Vida útil en días"}
                    inputType="input"
                  />
                  <CustomFormFieldInput
                    control={form.control}
                    name="itemInventory.warrantyPeriodInDays"
                    label={"Periodo de garantía en días"}
                    inputType="input"
                  />

                  <UomAutocompleteForm
                    control={form.control}
                    label={"Unidad de medida de peso"}
                    name="itemInventory.weightUom"
                    onSelect={(e) => {
                      form.setValue("itemInventory.weightUomID", e.id);
                    }}
                  />
                  <CustomFormFieldInput
                    control={form.control}
                    name="itemInventory.wightPerUnit"
                    label={"Peso por unidad"}
                    inputType="input"
                  />
                  <CustomFormFieldInput
                    control={form.control}
                    name="itemInventory.hasSerialNo"
                    label={"Tiene número de serie"}
                    inputType="check"
                  />
                  <CustomFormFieldInput
                    control={form.control}
                    name="itemInventory.serialNoTemplate"
                    label={"Serie de números de serie"}
                    inputType="input"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </fetcher.Form>
        </Form>
      </FormLayout>
    </Card>
  );
}
