import Typography, { subtitle } from "@/components/typography/Typography";

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

import { Permission } from "~/types/permission";
import { action, loader } from "../../route";
import { useItemStore } from "../../item-store";
import { itemSchema, ItemSchema } from "~/util/data/schemas/stock/item-schemas";
import ItemForm from "../item-form";
export default function ItemInfo({
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
  permission: Permission;
}) {
  const key = route.item;
  const payload = useModalStore((state) => state.payload[key]) || {};
  const { editPayload } = useModalStore();
  const item = data?.item;
  const { t, i18n } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toastID, setToastID] = useState<string | number>("");
  const id = searchParams.get(route.item);
  const params = useParams();
  const paramAction = searchParams.get("action");
  const itemStore = useItemStore();

  const onSubmit = (e: ItemSchema) => {
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
    let action = payload.isNew ? "create-item" : "edit-item";
    fetcher.submit(
      {
        action,
        itemData: e,
      },
      {
        method: "POST",
        encType: "application/json",
        action: route.toRouteDetail(route.item, params.id),
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
            itemStore.onCreateItem(fetcher.data?.item);
            closeModal();
          }
          if (fetcher.data?.item) {
            searchParams.set(route.item, fetcher.data?.item.id.toString());
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
    <div className="grid  gap-3">
      <div className="">
        <SmartForm
          isNew={payload.isNew || false}
          title={t("info")}
          schema={itemSchema}
          keyPayload={key}
          permission={permission}
          defaultValues={{
            id: item?.id,
            name: item?.name,
            code: item?.pn,
            group: {
              id: item?.group_id,
              name: item?.group_name,
            },
            uom: {
              id: item?.uom_id,
              name: item?.uom_name,
            },
            maintainStock: item?.maintain_stock || false,
            description: item?.description,
            //Inventary settings
            shelfLifeInDays: item?.shelf_life_in_days,
            warrantyPeriodInDays: item?.warranty_period_in_days,
            hasSerialNo: item?.has_serial_no,
            serialNoTemplate: item?.serial_no_template,
            weightUom: {
              id: item?.weight_uom_id,
              name: item?.weight_uom,
            },
            weightPerUnit: item?.weight_per_unit,
          }}
          onSubmit={onSubmit}
        >
          <ItemForm />
        </SmartForm>
      </div>
      {/* {item?.id != undefined && (
        <div className=" col-span-3">
          <ActivityFeed
            appContext={appContext}
            activities={data?.activities || []}
            partyID={item?.id}
            partyName={item.name}
            entityID={Entity.ITEM}
          />
        </div>
      )} */}
    </div>
  );
}
