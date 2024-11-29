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
import { useEffect } from "react";
import { useDocumentStore } from "@/components/custom/shared/document/use-document-store";
import { createOrderSchema } from "~/util/data/schemas/buying/purchase-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatRFC3339 } from "date-fns";
import { CustomFormTime } from "@/components/custom/form/CustomFormTime";
import CustomFormDate from "@/components/custom/form/CustomFormDate";
import { Form } from "@/components/ui/form";
import PartyAutocomplete from "~/routes/home.order.$partyOrder.new/components/party-autocomplete";
import AccountingDimensionForm from "@/components/custom/shared/accounting/accounting-dimension-form";

export default function OrderInfoTab() {
  const { order, lineItems, taxLines, acctDimension } =
    useLoaderData<typeof loader>();
  const { t, i18n } = useTranslation("common");
  const { roleActions } = useOutletContext<GlobalState>();
  const params = useParams();
  const partyOrder = params.partyOrder || "";
  const fetcher = useFetcher<typeof action>();
  const form = useForm<z.infer<typeof createOrderSchema>>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      partyID: order?.party_id,
      partyName: order?.party_name,
      currency: order?.currency,
      postingTime: formatRFC3339(new Date()),
      postingDate: new Date(order?.posting_date || new Date()),
      deliveryDate: new Date(order?.delivery_date || new Date()),
      tz: order?.tz,
      projectID:acctDimension?.project_id,
      projectName:acctDimension?.project,
      costCenterID:acctDimension?.cost_center_id,
      costCenterName:acctDimension?.cost_center,
    },
  });
  const formValues = form.getValues();
  const { companyDefaults } = useOutletContext<GlobalState>();
  const documentStore = useDocumentStore();
  useEffect(() => {
    documentStore.setData({
      partyID: order?.party_id,
      documentRefernceID: order?.id,
      partyName: order?.party_name,
      currency: order?.currency,
      projectID: acctDimension?.project_id,
      projectName: acctDimension?.project,
      costCenterID: acctDimension?.cost_center_id,
      costCenterName: acctDimension?.cost_center,
    });
  }, [order]);
  return (
    <Form {...form}>
      <fetcher.Form>
        <div className="info-grid">
          <PartyAutocomplete
            party={partyOrder}
            roleActions={roleActions}
            form={form}
          />

          <CustomFormDate
            control={form.control}
            name="postingDate"
            label={t("form.postingDate")}
          />
          <CustomFormTime
            control={form.control}
            name="postingTime"
            label={t("form.postingTime")}
            description={formValues.tz}
          />
          <CustomFormDate
            control={form.control}
            name="deliveryDate"
            label={t("form.deliveryDate")}
          />

          <AccountingDimensionForm form={form} />

          <LineItemsDisplay
            currency={order?.currency || companyDefaults?.currency || ""}
            status={order?.status || ""}
            lineItems={lineItems}
            partyType={params.partyReceipt || ""}
            itemLineType={ItemLineType.QUOTATION_LINE_ITEM}
          />
          {order && (
            <>
              <TaxAndCharges
                currency={order.currency}
                status={order.status}
                taxLines={taxLines}
                docPartyID={order.id}
              />

              <GrandTotal currency={order.currency} />

              <TaxBreakup currency={order.currency} />
            </>
          )}
        </div>
      </fetcher.Form>
    </Form>
  );
}
