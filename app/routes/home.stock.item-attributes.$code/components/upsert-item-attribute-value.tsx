import CustomForm from "@/components/custom/form/CustomForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useToast } from "@/components/ui/use-toast";
import { useFetcher, useRevalidator } from "@remix-run/react";
import { useTranslation, withTranslation } from "react-i18next";
import { z } from "zod";
import { makeZodI18nMap } from "zod-i18n-map";
import { action } from "../route";
import { useEffect } from "react";
import { components } from "~/sdk";

export const upsertItemAttributeValueSchema = z.object({
  value: z.string(),
  abbreviation: z.string(),
  ordinal: z.string(),
  itemAttributeId: z.number().optional(),
  id:z.number().optional(),
});
export default function UpsertItemAttributeValue({
  open,
  close,
  title,
  itemAttributeValue,
  itemAttribute,
}: {
  open: boolean;
  close: () => void;
  title: string;
  itemAttributeValue?: components["schemas"]["ItemAttributeValueDto"];
  itemAttribute: components["schemas"]["ItemAttributeDto"];
}) {
  const { t } = useTranslation("common");
  z.setErrorMap(
    makeZodI18nMap({
      t: t,
      ns: "zod",
      handlePath: {
        ns: "zod",
      },
    })
  );
  const fetcher = useFetcher<typeof action>();
  const { toast } = useToast();

  useEffect(() => {
    if (fetcher.data?.error) {
      toast({
        title: fetcher.data.error,
      });
    }
    if (fetcher.data?.responseMessage) {
      toast({
        title: fetcher.data.responseMessage,
      });
      close()
    }
  }, [fetcher.data]);
  return (
    <DrawerLayout open={open} onOpenChange={() => close()} title={title}
    className="">
      <CustomForm
        schema={upsertItemAttributeValueSchema}
        fetcher={fetcher}
        className="grid grid-cols-1"
        defaultValues={{
            ordinal:itemAttributeValue?.ordinal.toString(),
            value:itemAttributeValue?.value,
            abbreviation:itemAttributeValue?.abbreviation,
            id:itemAttributeValue?.id
        } as z.infer<typeof upsertItemAttributeValueSchema>}
        formItemsData={[
          {
            name: "value",
            type: "string",
            typeForm: "input",
            label: t("_stock.itemAttributeValue"),
          },
          {
            name: "ordinal",
            type: "number",
            typeForm: "input",
            label: t("table.no"),
            readOnly: true,
          },
          {
            name: "abbreviation",
            type: "string",
            typeForm: "input",
            label: t("table.abbreviation"),
          },
        ]}
        onSubmit={(e: z.infer<typeof upsertItemAttributeValueSchema>) => {
          console.log("DATA", e.abbreviation);
          let body = e;
          body = {
            ...body,
            itemAttributeId: itemAttribute.id,
          };
          // console.log("VALUES",body,itemAttributeValue)
          fetcher.submit(
            {
              action: itemAttributeValue
                ? "update-item-attribute-value"
                : "create-item-attribute-value",
              itemAttributeData: body,
            },
            {
              encType: "application/json",
              method: "POST",
              action: "./",
            }
          );
        }}
      />
    </DrawerLayout>
  );
}
