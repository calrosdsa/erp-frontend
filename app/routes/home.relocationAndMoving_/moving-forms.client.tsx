import { DataTable } from "@/components/custom/table/CustomTable";
import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import { movingFormColumns } from "@/components/custom/table/columns/piano/moving-form-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import PaginationLayout from "@/components/layout/pagination-layout";
import { useTranslation } from "react-i18next";

export default function MovingForms() {
  const { paginationResult } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  setUpToolbar(() => {
    return {};
  }, []);
  return (
    <PaginationLayout
      orderOptions={[
        { name: t("table.createdAt"), value: "created_at" },
        { name: t("form.email"), value: "email" },
        { name: t("form.phoneNumber"), value: "phone_number" },
        { name: t("form.movingDate"), value: "moving_date" },
      ]}
    >
      <DataTable
        data={paginationResult?.results || []}
        paginationOptions={{
          rowCount: paginationResult?.total,
        }}
        columns={movingFormColumns({})}
      />
    </PaginationLayout>
  );
}
