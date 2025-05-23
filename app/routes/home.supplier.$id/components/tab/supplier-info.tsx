import { loader } from "../../route";
import { useFetcher, useSearchParams } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import { route } from "~/util/route";

import { z } from "zod";
import { useLoadingTypeToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useEffect, useRef, useState } from "react";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { GlobalState } from "~/types/app-types";
import { SerializeFrom } from "@remix-run/node";
import { mapToContactSchema } from "~/util/data/schemas/contact/contact.schema";
import { SmartForm } from "@/components/form/smart-form";
import { useModalStore } from "@/components/ui/custom/modal-layout";
import { CREATE, DEFAULT_ID, LOADING_MESSAGE } from "~/constant";
import { toast } from "sonner";
import ActivityFeed from "~/routes/home.activity/components/activity-feed";
import { Entity } from "~/types/enums";
import {
  SupplierData,
  supplierSchema,
} from "~/util/data/schemas/buying/supplier-schema";
import SupplierForm from "../../supplier-form";
import { action } from "~/routes/home.supplier_/route";
import { useSupplierStore } from "../../supplier-store";
export default function SupplierInfo({
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
  const key = route.supplier;
  const payload = useModalStore((state) => state.payload[key]) || {};
  const { editPayload } = useModalStore();
  const supplier = data?.supplier;
  const contacts = data?.contacts;
  const { t, i18n } = useTranslation("common");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const fetcher = useFetcher<typeof action>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toastID, setToastID] = useState<string | number>("");
  const id = searchParams.get(route.supplier);
  const paramAction = searchParams.get("action");
  const supplierStore = useSupplierStore();

  const onSubmit = (e: SupplierData) => {
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
    let action = e.supplierID ? "edit-supplier" : "create-supplier";
    fetcher.submit(
      {
        action,
        supplierData: e,
      },
      {
        method: "POST",
        encType: "application/json",
        action: route.to(route.supplier),
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
            supplierStore.onCreateSupplier(fetcher.data?.supplier);
            closeModal();
          }
          if (fetcher.data?.supplier) {
            searchParams.set(
              route.supplier,
              fetcher.data?.supplier.id.toString()
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
          title={"Info"}
          schema={supplierSchema}
          keyPayload={key}
          defaultValues={{
            supplierID: supplier?.id,
            name: supplier?.name,
            group: {
              id: supplier?.group_id,
              name: supplier?.group,
            },
            contacts:
              contacts?.map((t) => mapToContactSchema(t, supplier?.id)) || [],
          }}
          onSubmit={onSubmit}
        >
          <SupplierForm contacts={contacts || []} />
        </SmartForm>
      </div>
      {supplier?.id != undefined && (
        <div className=" col-span-5">
          <ActivityFeed
            appContext={appContext}
            activities={data?.activities || []}
            partyID={supplier?.id}
            partyName={supplier.name}
            entityID={Entity.SUPPLIER}
          />
        </div>
      )}
    </div>
  );
}
