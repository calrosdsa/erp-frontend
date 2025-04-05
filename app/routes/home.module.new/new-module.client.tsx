import { Card } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  moduleDataSchema,
  ModuleDataType,
} from "~/util/data/schemas/core/module-schema";
import ModuleData from "./module-data";
import { useFetcher, useNavigate } from "@remix-run/react";
import { action } from "./route";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import { route } from "~/util/route";
import { party } from "~/util/party";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import CreateLayout from "@/components/layout/create-layout";

export default function NewModuleClient({}) {
  const form = useForm<ModuleDataType>({
    resolver: zodResolver(moduleDataSchema),
    defaultValues:{
        sections:[],
        priority:0,
        has_direct_access:false,
    }
  });
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const r = route;
  const p = party;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onSubmit = (e: ModuleDataType) => {
    fetcher.submit({
      action:"create-module",
      moduleData:e
    },{
      method:"POST",
      encType:"application/json",
    })
  };

  useLoadingTypeToolbar(
    {
      loading: fetcher.state == "submitting",
      loadingType: "SAVE",
    },
    [fetcher.state]
  );

  setUpToolbar(() => {
    return {
      titleToolbar: t("f.add-new", {
        o: t("module"),
      }),
      onSave: () => {
        inputRef.current?.click();
      },
    };
  }, []);

  useDisplayMessage(
    {
      error: fetcher.data?.error,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (fetcher.data?.module) {
          navigate(
            r.toRoute({
              main: p.module,
              routeSufix: [fetcher.data.module.uuid],
              q: {
                tab: "info",
              },
            })
          );
        }
      },
    },
    [fetcher.data]
  );
  return (

    <CreateLayout>
      <ModuleData
        form={form}
        allowCreate={true}
        allowEdit={true}
        onSubmit={onSubmit}
        fetcher={fetcher}
        inputRef={inputRef}
      />
    </CreateLayout>
  );
}
