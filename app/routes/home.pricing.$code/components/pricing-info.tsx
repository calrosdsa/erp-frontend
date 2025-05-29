import { useFetcher, useLoaderData, useOutletContext } from "@remix-run/react";
import { action, loader } from "../route";
import FormLayout from "@/components/custom/form/FormLayout";
import { z } from "zod";
import {
  mapPricingChargeDto,
  mapPricingLineItemData,
  mapPricingLineItemDto,
  pricingDataSchema,
} from "~/util/data/schemas/pricing/pricing-schema";
import {
  displayMessage,
  useDisplayMessage,
} from "~/util/hooks/ui/useDisplayMessage";
import {
  setUpToolbar,
  setUpToolbarTab,
  useLoadingTypeToolbar,
  useSetupToolbarStore,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useEditFields } from "~/util/hooks/useEditFields";
import {
  FormEvent,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { useTranslation } from "react-i18next";
import PricingData from "~/routes/home.pricing.new/compoments/pricing-data";
import { Entity } from "~/types/enums";
import { useConfirmationDialog } from "@/components/layout/drawer/ConfirmationDialog";
import { State, stateFromJSON } from "~/gen/common";
import { ButtonToolbar } from "~/types/actions";
import { components } from "~/sdk";
import { useToolbar } from "~/util/hooks/ui/use-toolbar";
import { toast } from "sonner";
import { LOADING_MESSAGE } from "~/constant";
import { useFetcherWithPromise } from "~/util/hooks/use-fetcher-with-promise";
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
export default function PricingInfo({}: // inputRef
{
  // inputRef:MutableRefObject<HTMLInputElement | null>
}) {
  const { t } = useTranslation("common");
  const { pricing, pricingCharges, pricingLines, actions } =
    useLoaderData<typeof loader>();
  const { companyDefaults, roleActions } = useOutletContext<GlobalState>();
  const [permission] = usePermission({
    actions: actions && actions[Entity.PRICING],
    roleActions,
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const { form, hasChanged, updateRef } = useEditFields<EditType>({
    schema: pricingDataSchema,
    defaultValues: {
      pricing_charges: pricingCharges.map((t) => mapPricingChargeDto(t)),
      pricing_line_items: pricingLines.map((t) => mapPricingLineItemDto(t)),
      id: pricing?.id,
      customer: {
        id: pricing?.customer_id,
        name: pricing?.customer,
        uuid: pricing?.customer_uuid,
      },
      project: {
        id: pricing?.project_id,
        name: pricing?.project,
        uuid: pricing?.project_uuid,
      },
      costCenter: {
        id: pricing?.cost_center_id,
        name: pricing?.cost_center,
        uuid: pricing?.cost_center_uuid,
      },
    },
  });
  const [poPerm] = usePermission({
    roleActions,
    actions: actions && actions[Entity.PURCHASE_ORDER],
  });
  const [quoPerm] = usePermission({
    roleActions,
    actions: actions && actions[Entity.QUOTATION],
  });
  const confirmationDialog = useConfirmationDialog();
  const { setRegister } = useSetupToolbarStore();
  const [toastID, setToastID] = useState<string | number>("");

  const allowEdit = permission?.edit || false;
  const fetcherPromise = useFetcherWithPromise<typeof action>();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit(async (values: EditType) => {
      const id = toast.loading(LOADING_MESSAGE);
      setToastID(id);
      const res = await fetcherPromise.submit(
        {
          action: "edit",
          editData: values,
        },
        {
          method: "POST",
          encType: "application/json",
        }
      );
      displayMessage({
        toastID: id,
        error: res?.error,
        success: res?.message,
      });
      // console.log("onsubmit.................-----------------", values);
      // fetcher.submit(
      //   {
      //     action: "edit",
      //     editData: values,
      //   },
      //   {
      //     method: "POST",
      //     encType: "application/json",
      //   }
      // );
    })(e);
  };

  const generate = async (
    action: string,
    pricing: components["schemas"]["PricingDto"]
  ) => {
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
    const body: components["schemas"]["PricingDataRequestBody"] = {
      pricing: pricing,
      pricing_line_items: form
        .getValues()
        .pricing_line_items.map((t) => mapPricingLineItemData(t)),
    };
    console.log("BODY", body);
    const res = await fetcherPromise.submit(
      {
        action: action,
        pricingData: body,
      },
      {
        method: "POST",
        encType: "application/json",
      }
    );
    displayMessage({
      toastID: id,
      error: res?.error,
      success: res?.message,
    });
  };

 

  useEffect(() => {
    const state = stateFromJSON(pricing?.status);

    let actions: ButtonToolbar[] = [];
    if (poPerm.create && state == State.SUBMITTED && pricing) {
      actions.push({
        label: "Generar Orden de Compras",
        onClick: () => {
          confirmationDialog.onOpenDialog({
            onConfirm: () => {
              generate("generate-po", pricing);
            },
          });
        },
      });
    }
    if (
      quoPerm.create &&
      state == State.SUBMITTED &&
      pricing &&
      pricing.customer_id
    ) {
      actions.push({
        label: "Generar Cotización de Venta",
        onClick: () => {
          confirmationDialog.onOpenDialog({
            onConfirm: () => {
              generate("generate-quotation", pricing);
            },
          });
        },
      });
    }
    setRegister("tab", {
      actions: actions,
      onSave: () => {
        inputRef.current?.click();
      },
      disabledSave: !allowEdit,
    });
  }, [allowEdit, pricing]);

  return (
    <>
      {/* {JSON.stringify(fetcher.data)} */}
      {form.getValues().pricing_charges && (
        <PricingData
          fetcher={fetcher}
          onSubmit={onSubmit}
          inputRef={inputRef}
          form={form}
        />
      )}
    </>
  );
}
