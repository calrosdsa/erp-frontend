import {
  useFetcher,
  useLoaderData,
  useOutletContext,
  useParams,
} from "@remix-run/react";
import { GlobalState, OrderGlobalState } from "~/types/app";
import { useTranslation } from "react-i18next";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { formatMediumDate } from "~/util/format/formatDate";
import { ItemLineType, State, stateFromJSON, stateToJSON } from "~/gen/common";
import { action, loader } from "../../route";
import LineItems from "@/components/custom/shared/item/line-items";
import LineItemsDisplay from "@/components/custom/shared/item/line-items-display";
import { TaxBreakup } from "@/components/custom/shared/accounting/tax/tax-breakup";
import GrandTotal from "@/components/custom/shared/item/grand-total";
import TaxAndCharges from "@/components/custom/shared/accounting/tax/tax-and-charges";
import { useEffect, useRef } from "react";
import { useDocumentStore } from "@/components/custom/shared/document/use-document-store";
import {
  createOrderSchema,
  editOrderSchema,
} from "~/util/data/schemas/buying/purchase-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatRFC3339 } from "date-fns";
import { CustomFormTime } from "@/components/custom/form/CustomFormTime";
import { Form } from "@/components/ui/form";
import PartyAutocomplete from "~/routes/home.order.$partyOrder.new/components/party-autocomplete";
import AccountingDimensionForm from "@/components/custom/shared/accounting/accounting-dimension-form";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { usePermission } from "~/util/hooks/useActions";
import { Separator } from "@/components/ui/separator";
import CurrencyAndPriceList from "@/components/custom/shared/document/currency-and-price-list";
import { useEditFields } from "~/util/hooks/useEditFields";
import { isEqual } from "lodash";

type EditData = z.infer<typeof editOrderSchema>;
export default function OrderInfoTab() {
  const { order, lineItems, taxLines, actions } =
    useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const { roleActions } = useOutletContext<GlobalState>();
  const params = useParams();
  const partyOrder = params.partyOrder || "";
  const fetcher = useFetcher<typeof action>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { form, hasChanged, updateRef, previousValues } =
    useEditFields<EditData>({
      schema: editOrderSchema,
      defaultValues: {
        id: order?.id,
        partyID: order?.party_id,
        partyName: order?.party_name,
        currency: order?.currency,
        postingTime: order?.posting_time,
        postingDate: new Date(order?.posting_date || new Date()),
        deliveryDate: new Date(order?.delivery_date || new Date()),
        tz: order?.tz,
        projectID: order?.project_id,
        projectName: order?.project,
        costCenterID: order?.cost_center_id,
        costCenterName: order?.cost_center,
      },
    });
  const formValues = form.getValues();
  const [orderPerm] = usePermission({ roleActions, actions });
  const isDraft = stateFromJSON(order?.status) == State.DRAFT;
  const allowEdit = isDraft && orderPerm?.edit;
  const allowCreate = isDraft && orderPerm.create;
  const { companyDefaults } = useOutletContext<GlobalState>();
  const documentStore = useDocumentStore();

  const onSubmit = (e: EditData) => {
    fetcher.submit(
      {
        action: "edit",
        editData: e as any,
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

  setUpToolbar(
    (opts) => {
      return {
        ...opts,
        onSave: () => inputRef.current?.click(),
        disabledSave: !hasChanged,
      };
    },
    [hasChanged]
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

  useEffect(() => {
    documentStore.setData({
      partyID: order?.party_id,
      documentRefernceID: order?.id,
      partyName: order?.party_name,
      currency: order?.currency,
      projectID: order?.project_id,
      projectName: order?.project,
      costCenterID: order?.cost_center_id,
      costCenterName: order?.cost_center,
    });
  }, [order]);
  return (
    <Form {...form}>
      <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="info-grid">
          <PartyAutocomplete
            party={partyOrder}
            roleActions={roleActions}
            form={form}
            allowEdit={allowEdit}
          />

          <CustomFormDate
            control={form.control}
            name="postingDate"
            label={t("form.postingDate")}
            allowEdit={allowEdit}
          />
          <CustomFormTime
            control={form.control}
            name="postingTime"
            label={t("form.postingTime")}
            description={formValues.tz}
            allowEdit={allowEdit}
          />
          <CustomFormDate
            control={form.control}
            name="deliveryDate"
            label={t("form.deliveryDate")}
            allowEdit={allowEdit}
          />
          <Separator className=" col-span-full" />

          <CurrencyAndPriceList form={form} allowEdit={allowEdit} />
          <AccountingDimensionForm form={form} allowEdit={allowEdit} />

          <LineItemsDisplay
            currency={order?.currency || companyDefaults?.currency || ""}
            status={order?.status || ""}
            lineItems={lineItems}
            partyType={params.partyReceipt || ""}
            itemLineType={ItemLineType.QUOTATION_LINE_ITEM}
            allowCreate={allowCreate}
            allowEdit={allowEdit}
          />
          {order && (
            <>
              <TaxAndCharges
                currency={order.currency}
                status={order.status}
                taxLines={taxLines}
                docPartyID={order.id}
                allowCreate={allowCreate}
                allowEdit={allowEdit}
              />

              <GrandTotal currency={order.currency} />

              <TaxBreakup currency={order.currency} />
            </>
          )}
        </div>
        <input className="hidden" type="submit" ref={inputRef} />
      </fetcher.Form>
    </Form>
  );
}
