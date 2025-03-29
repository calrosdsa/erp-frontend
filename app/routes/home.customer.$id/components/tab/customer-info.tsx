import Typography, { subtitle } from "@/components/typography/Typography";
import { action, loader } from "../../route";
import {
  useFetcher,
} from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import {
  CustomerData,
  customerSchema,
} from "~/util/data/schemas/selling/customer-schema";

import { z } from "zod";
import { useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useEffect, useRef } from "react";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { SerializeFrom } from "@remix-run/node";
import { mapToContactSchema } from "~/util/data/schemas/contact/contact.schema";
import { SmartForm } from "@/components/form/smart-form";
import CustomerForm from "../../customer-form";
export default function CustomerInfo({
  appContext,
  data,
}: {
  appContext: GlobalState;
  data?: SerializeFrom<typeof loader>;
}) {
  const customer = data?.customer;
  const contacts = data?.contacts;
  const { t, i18n } = useTranslation("common");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();

 
  const onSubmit = (e: CustomerData) => {
    fetcher.submit(
      {
        action: "edit-customer",
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
  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );



  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {

      },
    },
    [fetcher.data]
  );

  return (
    <div className="grid grid-cols-9 gap-3">
      <div className="col-span-4">
        <SmartForm
          title={t("_customer.info")}
          schema={customerSchema}
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
          <CustomerForm contacts={contacts || []} inputRef={inputRef} />
        </SmartForm>
      </div>
    </div>
  );
}
