import { useFetcher, useLoaderData, useOutletContext, useSearchParams } from "@remix-run/react";
import { loader } from "./route";
import { SmartForm } from "@/components/form/smart-form";
import { useTranslation } from "react-i18next";
import {
  roleDataSchema,
  RoleSchema,
} from "~/util/data/schemas/manage/role-schema";
import { action } from "../home.manage.roles_/route";
import { useState } from "react";
import { toast } from "sonner";
import { LOADING_MESSAGE } from "~/constant";
import { route } from "~/util/route";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import RoleForm from "./role-form";
import { GlobalState } from "~/types/app-types";

export default function RoleInfo({
  keyPayload,
  allowEdit,
}: {
  keyPayload: string;
  allowEdit: boolean;
}) {
  const { role } = useLoaderData<typeof loader>();

  const fetcher = useFetcher<typeof action>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [toastID, setToastID] = useState<string | number>("");
  const id = searchParams.get(route.workspace);
  const { t } = useTranslation("common");
  const appContext = useOutletContext<GlobalState>()

  const openModal = (key: string, value: any) => {
    searchParams.set(route.workspace, value);
    setSearchParams(searchParams, {
      preventScrollReset: true,
    });
  };
  const onSubmit = (e: RoleSchema) => {
    console.log("ONSUBMIT", e);
    const id = toast.loading(LOADING_MESSAGE);
    setToastID(id);
    let action = e.id ? "edit-role" : "create-role";
    fetcher.submit(
      {
        action,
        roleData: e,
      },
      {
        method: "POST",
        encType: "application/json",
        action: route.to(route.role),
      }
    );
  };

  useDisplayMessage(
    {
      toastID: toastID,
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {},
    },
    [fetcher.data]
  );

  return (
    <>
      {/* {JSON.stringify(role)} */}
      <SmartForm
        isNew={false}
        title={"Info"}
        schema={roleDataSchema}
        enableSaveButton={true}
        keyPayload={keyPayload}
        defaultValues={{
          id: role?.id,
          code: role?.code || "",
          workspace: {
            id: role?.workspace_id,
            name: role?.workspace,
          },
        }}
        onSubmit={onSubmit}
      >
        <RoleForm allowEdit={allowEdit} openModal={openModal}
        appContext={appContext} />
      </SmartForm>
    </>
  );
}
