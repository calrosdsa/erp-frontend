import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { action, loader } from "../route";
import FormLayout from "@/components/custom/form/FormLayout";
import { z } from "zod";
import {
  editPricingSchema,
  mapPricingChargeDto,
  mapPricingLineItemData,
  mapPricingLineItemDto,
  pricingDataSchema,
} from "~/util/data/schemas/pricing/pricing-schema";
import { Form } from "@/components/ui/form";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useEditFields } from "~/util/hooks/useEditFields";
import { FormEvent, MutableRefObject, useRef } from "react";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app";
import { useTranslation } from "react-i18next";
import PricingData from "~/routes/home.pricing.new/compoments/pricing-data";
import { Entity } from "~/types/enums";
import { useConfirmationDialog } from "@/components/layout/drawer/ConfirmationDialog";
import { State, stateFromJSON } from "~/gen/common";
import { ButtonToolbar } from "~/types/actions";
import { components } from "~/sdk";
const defaultPricingCharges = [
  { name: "Flete", rate: 0.07, orderID: 1 },
  { name: "Importacion", rate: 0.13, orderID: 2 },
  { name: "Margen", rate: 0.2509825, orderID: 3 },
  { name: "Impuestos", rate: 0.192, orderID: 4 },
  { name: "Retencion", rate: 0.1429, orderID: 5 },
  { name: "TVA", rate: 0.7, orderID: 6 },
  { name: "TC", rate: 7.5, orderID: 7 },
  { name: "Descuento", rate: 0.45, orderID: 8 },
];
type EditType = z.infer<typeof pricingDataSchema>;
export default function PricingInfo({
  // inputRef  
}:{
  // inputRef:MutableRefObject<HTMLInputElement | null>
}) {
  const { t } = useTranslation("common");
  const { pricing, pricingCharges, pricingLines, actions } =
    useLoaderData<typeof loader>();
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({ actions:actions && actions[Entity.PRICING], roleActions });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const { form, hasChanged, updateRef } = useEditFields<EditType>({
    schema: pricingDataSchema,
    defaultValues: {
      pricing_charges: pricingCharges.map((t) => mapPricingChargeDto(t)),
      pricing_line_items: pricingLines.map((t) => mapPricingLineItemDto(t)),
      id: pricing?.id,
      customer:pricing?.customer,
      customer_id:pricing?.customer_id,
    },
  });
  const [poPerm] = usePermission({
    roleActions,
    actions:actions && actions[Entity.PURCHASE_ORDER],
  });
  const [quoPerm] = usePermission({
    roleActions,
    actions:actions && actions[Entity.QUOTATION],
  });
  const confirmationDialog = useConfirmationDialog()
  
  const allowEdit = permission?.edit || false;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    console.log("onsubmit.................-----------------", "121212");
    e.preventDefault();
    form.handleSubmit((values: EditType) => {
      console.log("onsubmit.................-----------------", values);
      fetcher.submit(
        {
          action: "edit",
          editData: values,
        },
        {
          method: "POST",
          encType: "application/json",
        }
      );
    })(e);
  };

 

  const generate = (action:string,pricing:components["schemas"]["PricingDto"])=>{
    const body:components["schemas"]["PricingDataRequestBody"] = {
      pricing: pricing,
      pricing_line_items: form.getValues().pricing_line_items.map(t => mapPricingLineItemData(t)),
    }
    console.log("BODY",body)
    fetcher.submit({
      action:action,
      pricingData:body,
    },{
      method:"POST",
      encType:"application/json"
    })
  }

  setUpToolbar(
    (opts) => {
      const state = stateFromJSON(pricing?.status);

      let actions: ButtonToolbar[] = [];
      if (poPerm.create && state == State.SUBMITTED && pricing) {
        actions.push({
          label: "Generar Orden de Compras",
          onClick: () => {
            confirmationDialog.onOpenDialog({
              onConfirm:()=>{
                generate("generate-po",pricing)
              }
            })
          },
        });
      }
      if (quoPerm.create && state == State.SUBMITTED && pricing) {
        actions.push({
          label: "Generar Cotización de Venta",
          onClick: () => {
            confirmationDialog.onOpenDialog({
              onConfirm:()=>{
                generate("generate-quotation",pricing)
              }
            })
          },
        });
      }
      return {
        onSave: () => {inputRef.current?.click()},
        actions: actions,
      };
    },
    [pricing]
  );

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
  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );

  return form.getValues().pricing_charges && <PricingData fetcher={fetcher} onSubmit={onSubmit}
  inputRef={inputRef}
  form={form}
  defaultValues={{
    pricing_charges:pricingCharges.map(t=>mapPricingChargeDto(t)),
    pricing_line_items:pricingLines.map(t=>mapPricingLineItemDto(t))
  }} />;
}


