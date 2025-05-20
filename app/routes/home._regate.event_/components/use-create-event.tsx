// import CustomForm from "@/components/custom/form/CustomForm";
// import { DrawerLayout } from "@/components/layout/drawer/DrawerLayout";
// import { useFetcher } from "@remix-run/react";
// import { create } from "zustand";
// import { action } from "../route";
// import { z } from "zod";
// import { route } from "~/util/route";
// import { useTranslation } from "react-i18next";
// import { useToast } from "@/components/ui/use-toast";
// import { useEffect } from "react";
// import { Button } from "@/components/ui/button";

// export const CreateEvent = ({
//   open,
//   onOpenChange,
// }: {
//   open: boolean;
//   onOpenChange: (e: boolean) => void;
// }) => {
//   const fetcher = useFetcher<typeof action>();
//   const r = route;
//   const { t } = useTranslation("common");
//   const { toast } = useToast();
//   const onSubmit = (values: z.infer<typeof createEventSchema>) => {
//     fetcher.submit(
//       {
//         action: "create-event",
//         createEvent: values,
//       },
//       {
//         action: r.event,
//         method: "POST",
//         encType: "application/json",
//       }
//     );
//   };
//   useEffect(() => {
//     if (fetcher.data?.error) {
//       toast({
//         title: fetcher.data.error,
//       });
//       onOpenChange(false);
//     }
//     if (fetcher.data?.message) {
//       toast({
//         title: fetcher.data.message,
//       });
//       onOpenChange(false);
//     }
//   }, [fetcher.data]);
//   return (
//     <DrawerLayout
//       open={open}
//       onOpenChange={onOpenChange}
//       title={t("f.add-new", { o: t("regate._event.base") })}
//     >
//       <CustomForm
//         schema={createEventSchema}
//         fetcher={fetcher}
//         buttonClassName=" w-full"
//         onSubmit={onSubmit}
//         formItemsData={[
//           {
//             name: "name",
//             typeForm: "input",
//             label: t("form.name"),
//             required: true,
//           },
//           {
//             name: "description",
//             typeForm: "textarea",
//             label: t("form.description"),
//           },
//         ]}
//       />
//     </DrawerLayout>
//   );
// };
// interface CreateEventStore {
//   open: boolean;
//   onOpenChange: (e: boolean) => void;
// }

// export const useCreateEvent = create<CreateEventStore>((set) => ({
//   open: false,
//   onOpenChange: (e) =>
//     set((state) => ({
//       open: e,
//     })),
// }));
