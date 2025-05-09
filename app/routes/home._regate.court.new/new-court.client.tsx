import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetcher, useNavigate, useSearchParams } from "@remix-run/react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { createCourtSchema } from "~/util/data/schemas/regate/court-schema";
import { action } from "./route";
import { route } from "~/util/route";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/custom/form/CustomFormField";
import { Input } from "@/components/ui/input";
import CheckForm from "@/components/custom/input/CheckForm";
import { useEffect, useRef } from "react";
import { useToolbar } from "~/util/hooks/ui/use-toolbar";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { useDisplayMessage } from "~/util/hooks/ui/useDisplayMessage";
import CreateLayout from "@/components/layout/create-layout";

export default function NewCourtClient() {
  const { t } = useTranslation("common");
  const fetcher = useFetcher<typeof action>();
  const r = route;
  const { toast } = useToast();
  const form = useForm<z.infer<typeof createCourtSchema>>({
    resolver: zodResolver(createCourtSchema),
  });
  const toolbar = useToolbar();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const navigate = useNavigate();
  const onSubmit = (values: z.infer<typeof createCourtSchema>) => {
    fetcher.submit(
      {
        action: "create-court",
        createCourt: values,
      },
      {
        encType: "application/json",
        method: "POST",
      }
    );
  };

  setUpToolbar(() => {
    return {
      onSave: () => {
        inputRef.current?.click();
      },
      titleToolbar: "Nueva Cancha",
    };
  }, []);
  useDisplayMessage(
    {
      error: fetcher.data?.message,
      success: fetcher.data?.message,
      onSuccessMessage: () => {
        if (fetcher.data?.court) {
          const court = fetcher.data.court;
         navigate(route.to(route.court,{
         [route.court]:court.id,
         }))
        }
      },
    },
    [fetcher.data]
  );

  return (
    <CreateLayout>
      <FormLayout>
        <Form {...form}>
          <fetcher.Form onSubmit={form.handleSubmit(onSubmit)}>
            <div className=" create-grid">
              <CustomFormField
                name="name"
                label={t("form.name")}
                form={form}
                children={(field) => {
                  return <Input {...field} />;
                }}
              />
              {/* <CheckForm
              label={t("form.enabled")}
              form={form}
              name={"enabled"}
              description={t("f.enable", { o: t("regate._court.base") })}
              /> */}
            </div>
            <input ref={inputRef} type="submit" className="hidden" />
          </fetcher.Form>
        </Form>
      </FormLayout>
    </CreateLayout>
  );
}
