import Typography, { subtitle } from "@/components/typography/Typography";
import { action, loader } from "../route";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import {
  CustomerData,
  customerSchema,
} from "~/util/data/schemas/selling/customer-schema";

import { z } from "zod";
import { useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useEffect, useRef, useState } from "react";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { SerializeFrom } from "@remix-run/node";
import { mapToContactSchema } from "~/util/data/schemas/contact/contact.schema";
import { SmartForm } from "@/components/form/smart-form";
import CustomerForm from "../customer-form";
import { useModalStore } from "@/components/ui/custom/modal-layout";
import { CREATE, DEFAULT_ID, LOADING_MESSAGE } from "~/constant";
import { toast } from "sonner";
import ActivityFeed from "~/routes/home.activity/components/activity-feed";
import { Entity } from "~/types/enums";
import {  useCustomerStore } from "../customer-store";
export default function CustomerInfo({
  appContext,
  data,
  load,
  closeModal,
}: {
  appContext: GlobalState;
  data?: SerializeFrom<typeof loader>;
  load: () => void;
  closeModal: () => void;
}) {
  const key = route.customer;
  const payload = useModalStore((state) => state.payload[key]) || {};
  const { editPayload } = useModalStore();
  const customer = data?.customer;
  const contacts = data?.contacts;
  const { t, i18n } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toastID, setToastID] = useState<string | number>("");
  const id = searchParams.get(route.customer);
  const paramAction = searchParams.get("action");
  const customerStore = useCustomerStore();

  const onSubmit = (e: CustomerData) => {
    console.log("ONSUBMIT", e);
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
    let action = payload.isNew ? "create-customer" : "edit-customer";
    fetcher.submit(
      {
        action,
        customerData: e,
      },
      {
        method: "POST",
        encType: "application/json",
        action: route.toRoute({
          main: route.customer,
          routeSufix: [customer?.id.toString() || ""],
        }),
      }
    );
  };

  useDisplayMessage(
    {
      toastID: toastID,
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (id == DEFAULT_ID) {
          if (paramAction == CREATE) {
            customerStore.onCreateCustomer(fetcher.data?.customer);
            closeModal();
          }
          if (fetcher.data?.customer) {
            searchParams.set(
              route.customer,
              fetcher.data?.customer.id.toString()
            );
            setSearchParams(searchParams, {
              preventScrollReset: true,
              replace: true,
            });
          }
        } else {
          load();
        }
      },
    },
    [fetcher.data]
  );

  return (
    <div className="grid grid-cols-9 gap-3">
      <div className="col-span-4">
        <SmartForm
          isNew={payload.isNew || false}
          title={t("_customer.info")}
          schema={customerSchema}
          keyPayload={key}
          defaultValues={{
            name: customer?.name || "",
            customerType: customer?.customer_type || "",
            customerID: customer?.id,
            group: {
              id: customer?.group_id,
              name: customer?.group_name,
            },
            contacts:
              contacts?.map((t) => mapToContactSchema(t, customer?.id)) || [],
          }}
          onSubmit={onSubmit}
        >
          <CustomerForm contacts={contacts || []} />
        </SmartForm>
      </div>
      {customer?.id != undefined && (
        <div className=" col-span-5">
          <ActivityFeed
            appContext={appContext}
            activities={data?.activities || []}
            partyID={customer?.id}
            partyName={customer.name}
            entityID={Entity.CUSTOMER}
          />
        </div>
      )}
    </div>
  );
}
