import CustomForm from "@/components/custom/form/CustomForm";
import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
import { useFetcher } from "@remix-run/react";
import { create } from "zustand";
import { action } from "../route";
import { useTranslation } from "react-i18next";
import { useToast } from "@/components/ui/use-toast";
import { createGroupSchema } from "~/util/data/schemas/group-schema";
import { z } from "zod";
import { routes } from "~/util/route";
import { useEffect } from "react";

export const CreateGroup = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (e: boolean) => void;
}) => {
  const fetcher = useFetcher<typeof action>();
  const createGroup = useCreateGroup();
  const { t } = useTranslation("common");
  const { toast } = useToast();
  const r = routes;

  useEffect(() => {
    if (fetcher.data?.message) {
      toast({
        title: fetcher.data.message,
      });
      onOpenChange(false);
    }
    if (fetcher.data?.error) {
      toast({
        title: fetcher.data.error,
      });
    }
  }, [fetcher.data]);
  return (
    <DrawerLayout
      open={open}
      onOpenChange={onOpenChange}
      title={t("f.add-new", { o: t("group") })}
    >
      <CustomForm
        schema={createGroupSchema}
        fetcher={fetcher}
        defaultValues={
          {
            party_type_code: createGroup.partyType,
          } as z.infer<typeof createGroupSchema>
        }
        onSubmit={(values: z.infer<typeof createGroupSchema>) => {
          fetcher.submit(
            {
              action: "create-group",
              createGroup: values,
            },
            {
              method: "POST",
              encType: "application/json",
              action: r.toRoute({
                main: createGroup.partyType,
                routePrefix: [r.group],
              }),
            }
          );
        }}
        formItemsData={[
          {
            name: "name",
            label: t("form.name"),
            typeForm: "input",
            type: "string",
            required: true,
          },
          // {
          //   name: "is_group",
          //   label: t("form.isGroup"),
          //   description: t("form.isGroupDescription"),
          //   typeForm: "check",
          //   type: "boolean",
          // },
        ]}
        // renderCustomInputs={(form) => {
        //   return (
        //     <>
        //       <GroupAutocompleteForm
        //       control={form.control}
        //       label={t("group")}
        //       name="groupName"
        //       // roleActions={roleActions}
        //       // actions={entityActions && entityActions[Entity.ITEM_GROUP]}
        //       isGroup={true}
        //       partyType={r.itemGroup}
        //       onSelect={(e) => {
        //         form.setValue("parentID", e.id);
        //       }}
        //     />
        //     </>
        //   );
        // }}
      />
    </DrawerLayout>
  );
};

interface CreateGroupStore {
  open: boolean;
  onOpenChange: (e: boolean) => void;
  openDialog: (opts: { partyType: string }) => void;
  partyType: string;
}
export const useCreateGroup = create<CreateGroupStore>((set) => ({
  open: false,
  openDialog: (opts) =>
    set((state) => ({
      open: true,
      partyType: opts.partyType,
    })),
  onOpenChange: (e) => set((state) => ({ open: e })),
  partyType: "",
}));
