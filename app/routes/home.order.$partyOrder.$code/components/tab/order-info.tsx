import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { GlobalState } from "~/types/app-types";
import { useTranslation } from "react-i18next";
import {
  State,
  stateFromJSON,
} from "~/gen/common";
import { action, loader } from "../../route";

import { useEffect, useRef } from "react";
import { useDocumentStore } from "@/components/custom/shared/document/use-document-store";
import { orderDataSchema } from "~/util/data/schemas/buying/order-schema";
import { z } from "zod";
import {
  useLoadingTypeToolbar,
  useSetupToolbarStore,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { usePermission } from "~/util/hooks/useActions";
import { useEditFields } from "~/util/hooks/useEditFields";
import { useToolbar } from "~/util/hooks/ui/use-toolbar";
import { OrderData } from "~/routes/home.order.$partyOrder.new/order-data";
import { toTaxAndChargeLineSchema } from "~/util/data/schemas/accounting/tax-and-charge-schema";
import { toLineItemSchema } from "~/util/data/schemas/stock/line-item-schema";

type EditData = z.infer<typeof orderDataSchema>;
export default function OrderInfoTab() {
  const { order, lineItems, taxLines, actions } =
    useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const { roleActions } = useOutletContext<GlobalState>();
  const params = useParams();
  const partyOrder = params.partyOrder || "";
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { companyDefaults } = useOutletContext<GlobalState>();
  const { form, hasChanged, updateRef, previousValues } =
    useEditFields<EditData>({
      schema: orderDataSchema,
      defaultValues: {
        id: order?.id,
        currency: order?.currency || companyDefaults?.currency,
        postingTime: order?.posting_time,
        postingDate: new Date(order?.posting_date || new Date()),
        deliveryDate: new Date(order?.delivery_date || new Date()),
        tz: order?.tz,
        party: {
          id: order?.party_id,
          name: order?.party_name,
          uuid: order?.party_uuid,
        },
        project: {
          id: order?.project_id,
          name: order?.project,
          uuid: order?.project_uuid,
        },
        costCenter: {
          id: order?.cost_center_id,
          name: order?.cost_center,
          uuid: order?.cost_center_uuid,
        },
        priceList: {
          id: order?.price_list_id,
          name: order?.price_list,
          uuid: order?.price_list_uuid,
        },
        taxLines: taxLines.map((t) => toTaxAndChargeLineSchema(t)),
        lines: lineItems.map((t) =>
          toLineItemSchema(t, {
            partyType: partyOrder,
          })
        ),
      },
    });
  const [orderPerm] = usePermission({ roleActions, actions });
  const isDraft = stateFromJSON(order?.status) == State.DRAFT;
  const allowEdit = isDraft && orderPerm?.edit;
  const allowCreate = isDraft && orderPerm.create;
  const documentStore = useDocumentStore();
  const { setRegister } = useSetupToolbarStore();
  const onSubmit = (e: EditData) => {
    console.log("ONSUBMIT ORDER", e);
    fetcher.submit(
      {
        action: "edit",
        orderData: e as any,
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

  useEffect(() => {
    setRegister("tab", {
      onSave: () => {
        inputRef.current?.click();
      },
      disabledSave: !allowEdit,
    });
  }, [allowEdit]);

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

  useEffect(() => {
    documentStore.setData({
      partyID: order?.party_id,
      documentRefernceID: order?.id,
      partyName: order?.party_name,
      currency: order?.currency,
      priceListID: order?.price_list_id,
      priceListName: order?.price_list,
      projectID: order?.project_id,
      projectName: order?.project,
      costCenterID: order?.cost_center_id,
      costCenterName: order?.cost_center,
    });
  }, [order]);
  return (
    <>
      {/* {JSON.stringify(documentStore.payload)} */}
      <OrderData
        form={form}
        inputRef={inputRef}
        fetcher={fetcher}
        onSubmit={onSubmit}
        allowEdit={allowEdit}
        allowCreate={allowCreate}
      />
    </>
  );
}
