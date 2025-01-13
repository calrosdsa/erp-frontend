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
import { routes } from "~/util/route";
import { parties } from "~/util/party";
import {
  setUpToolbar,
  useLoadingTypeToolbar,
} from "~/util/hooks/ui/useSetUpToolbar";
import { useTranslation } from "react-i18next";
import { useRef } from "react";

export default function NewModuleClient({}) {
  const form = useForm<ModuleDataType>({
    resolver: zodResolver(moduleDataSchema),
    defaultValues:{
        sections:[],
    }
  });
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const { t } = useTranslation("common");
  const r = routes;
  const p = parties;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onSubmit = (e: ModuleDataType) => {};

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
    <Card>
      <ModuleData
        form={form}
        allowCreate={true}
        allowEdit={true}
        onSubmit={onSubmit}
        fetcher={fetcher}
        inputRef={inputRef}
      />
    </Card>
  );
}
