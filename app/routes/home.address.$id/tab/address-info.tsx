import Typography, { subtitle } from "@/components/typography/Typography";
import { action, loader } from "../route";
import { useFetcher, useParams, useSearchParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";
import { useEffect, useRef, useState } from "react";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { usePermission } from "~/util/hooks/useActions";
import { GlobalState } from "~/types/app-types";
import { SerializeFrom } from "@remix-run/node";
import { mapToContactSchema } from "~/util/data/schemas/contact/contact.schema";
import { SmartForm } from "@/components/form/smart-form";
import { useModalStore } from "@/components/ui/custom/modal-layout";
import { CREATE, DEFAULT_ID, LOADING_MESSAGE } from "~/constant";
import { toast } from "sonner";
import ActivityFeed from "~/routes/home.activity/components/activity-feed";
import { Entity } from "~/types/enums";
import { useAddressStore } from "../address-store";
import {
  AddressSchema,
  addressSchema,
} from "~/util/data/schemas/core/address.schema";
import AddressForm from "../address-form";
import { Permission } from "~/types/permission";
export default function AddressInfo({
  appContext,
  data,
  load,
  closeModal,
  permission,
}: {
  appContext: GlobalState;
  data?: SerializeFrom<typeof loader>;
  load: () => void;
  closeModal: () => void;
  permission:Permission
}) {
  const key = route.address;
  const payload = useModalStore((state) => state.payload[key]) || {};
  const { editPayload } = useModalStore();
  const address = data?.address;
  const { t, i18n } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toastID, setToastID] = useState<string | number>("");
  const id = searchParams.get(route.address);
  const params = useParams();
  const paramAction = searchParams.get("action");
  const addressStore = useAddressStore();

  const onSubmit = (e: AddressSchema) => {
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
    let action = payload.isNew ? "create-address" : "edit-address";
    fetcher.submit(
      {
        action,
        addressData: e,
      },
      {
        method: "POST",
        encType: "application/json",
        action: route.toRouteDetail(route.address, params.id),
      }
    );
    editPayload(key, {
      enableEdit: false,
    });
  };

  useDisplayMessage(
    {
      toastID: toastID,
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (id == DEFAULT_ID) {
          if (paramAction == CREATE) {
            addressStore.onCreateAddress(fetcher.data?.address);
            closeModal();
          }
          if (fetcher.data?.address) {
            searchParams.set(
              route.address,
              fetcher.data?.address.id.toString()
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
          title={t("info")}
          schema={addressSchema}
          keyPayload={key}
          permission={permission}
          defaultValues={{
            addressID: address?.id,
            title: address?.title || "",
            city: address?.city,
            streetLine1: address?.street_line1,
            streetLine2: address?.street_line2,
            province: address?.province,
            company: address?.company,
            postalCode: address?.postal_code,
            phoneNumber: address?.phone_number,
            identificationNumber: address?.identification_number,
            email: address?.email,
            countryCode: address?.country_code,
            isShippingAddress: address?.is_shipping_address || false,
            isBillingAddress: address?.is_billing_address || false,
          }}
          onSubmit={onSubmit}
        >
          <AddressForm />
        </SmartForm>
      </div>
      {address?.id != undefined && (
        <div className=" col-span-5">
          <ActivityFeed
            appContext={appContext}
            activities={data?.activities || []}
            partyID={address?.id}
            partyName={address.title}
            entityID={Entity.CUSTOMER}
          />
        </div>
      )}
    </div>
  );
}
