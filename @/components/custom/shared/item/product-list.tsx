import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher } from "@remix-run/react";
import { useForm, useWatch } from "react-hook-form";
import { ItemLineType, itemLineTypeToJSON } from "~/gen/common";
import { components, operations } from "~/sdk";
import {
  lineItemDefault,
  productListSchema,
  ProductListSchema,
  toLineItemSchema,
} from "~/util/data/schemas/stock/line-item-schema";
import { action } from "~/routes/api.itemline/route";
import { route } from "~/util/route";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DataTable } from "../../table/CustomTable";
import { lineItemsColumns } from "../../table/columns/order/line-item-column";
import { useActionsFieldArray } from "~/util/hooks/use-actions-field-array";
import { useModalStore } from "@/components/ui/custom/modal-layout";
import isEqual from "lodash/isEqual";
import { useToast } from "@/components/ui/use-toast";
import { toast } from "sonner";
import { LOADING_MESSAGE } from "~/constant";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import DisplayTextValue from "../../display/DisplayTextValue";
import { useLineItems } from "./use-line-items";
import { useTranslation } from "react-i18next";
import { formatCurrencyAmount } from "~/util/format/formatCurrency";

export default function ProductList({
  partyID,
  partyType,
  currency,
  lineType,
  allowEdit,
  priceListID,
  keyPayload,
  updateStock,
  items,
}: {
  partyID: number;
  partyType: string;
  currency: string;
  lineType: string;
  allowEdit?: boolean;
  priceListID?: number;
  keyPayload?: string;
  updateStock?: boolean;
  items:components["schemas"]["LineItemDto"][];
}) {

  const submitFetcher = useFetcher<typeof action>();
  const { editPayload } = useModalStore();
  const { total, lines: lineItems, totalQuantity, onLines } = useLineItems();
  const { i18n } = useTranslation("common");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const defaultValues = useMemo(() => {
    return {
      party_id: partyID,
      party_type: partyType,
      lines:
        items?.map((t) =>
          toLineItemSchema(t, {
            partyType: partyType,
          })
        ) || [],
    };
  }, [items]);
  const form = useForm<ProductListSchema>({
    resolver: zodResolver(productListSchema),
    defaultValues: defaultValues,
  });
  const [arrayFields, metaOptions] = useActionsFieldArray({
    control: form?.control,
    name: "lines",
    addRow: (append) => {
      const line = lineItemDefault({
        lineType: lineType,
        updateStock: updateStock,
      });
      append(line);
    },
    // onChange: () => {
    //   setIsEditing(true);
    // },
  });
  const formValues = form.getValues();
  const watchedValues = useWatch({ control: form.control });
  const [toastID, setToastID] = useState<string | number>("");

  const { update } = arrayFields;
  const updateCell = (row: number, column: string, value: string) => {
    let item = formValues?.lines[row] as any;
    if (item) {
      const currentValue = item[column];
      item[column] = typeof currentValue === "number" ? Number(value) : value;
      // form.setValue(`sections.${row}`,item)
      update(row, item);
    }
  };

  const setEnableEdit = (e: boolean) => {
    if (keyPayload) {
      editPayload(keyPayload, {
        enableEdit: e,
      });
    }
  };

  const onSubmit = useCallback(() => {
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
    setEnableEdit(false);
    submitFetcher.submit(
      {
        action: "upsert-products",
        productsData: formValues,
      },
      {
        method: "POST",
        encType: "application/json",
        action: route.apiItemLine,
      }
    );
  }, [formValues]);



  useDisplayMessage(
    {
      toastID: toastID,
      success: submitFetcher.data?.message,
      error: submitFetcher.data?.error,
    },
    [submitFetcher.data]
  );

  useEffect(() => {
    if (keyPayload) {
      const equal = isEqual(watchedValues, defaultValues);
      setEnableEdit(!equal);
    }
  }, [watchedValues]);

  useEffect(() => {
    
      form.setValue(
        "lines",
        items.map((t) =>
          toLineItemSchema(t, {
            partyType: partyType,
          })
        ) || []
      );
    
  }, [items]);

  useEffect(() => {
    onLines(formValues.lines);
  }, [formValues.lines]);

  useEffect(() => {
    if (keyPayload) {
      editPayload(keyPayload, {
        onSave: () => {
          inputRef.current?.click();
        },
      });
    }
  }, []);
  return (
    <div className="border p-2">
      {/* {JSON.stringify(fetcher.data?.lineItems)} */}
      {/* {JSON.stringify(formValues)} */}
      <submitFetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
        <DataTable
          data={formValues.lines}
          columns={lineItemsColumns({
            currency: currency,
            lineType: lineType,
            allowEdit: allowEdit,
            priceListID: priceListID,
            docPartyType: partyType,
          })}
          fullHeight={false}
          metaOptions={{
            meta: {
              ...metaOptions,
              ...(allowEdit && {
                updateCell: (row: number, column: string, value: string) => {
                  updateCell(row, column, value);
                },
              }),
            },
          }}
        />

        <input className="hidden" type="submit" ref={inputRef} />
      </submitFetcher.Form>
      <div className=" w-full flex justify-end">
      <div className="w-64 flex flex-col ">
      <DisplayTextValue
        title="Total"
        value={formatCurrencyAmount(total, currency, i18n.language)}
        />
      <DisplayTextValue
        title="Cantidad Total"
        value={totalQuantity.toString()}
        />
        </div>
        </div>
    </div>
  );
}
