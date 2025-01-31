import { DataTable } from "@/components/custom/table/CustomTable";
import DataLayout from "@/components/layout/data-layout";
import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useSearchParams,
} from "@remix-run/react";
import { GlobalState } from "~/types/app";
import { loader } from "./route";
import { termsAndConditionsColumns } from "@/components/custom/table/columns/document/terms-and-conditions-columns";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { usePermission } from "~/util/hooks/useActions";
import { route } from "~/util/route";
import { useTranslation } from "react-i18next";
import { BankAccountColumns } from "@/components/custom/table/columns/accounting/bank-account.columns";
import {
  PartySearch,
  PartyTypeSearch,
} from "~/util/hooks/fetchers/usePartyDebounceFetcher";

export default function BankAccountClient() {
  const { roleActions } = useOutletContext<GlobalState>();
  const [searchParams] = useSearchParams();
  const { results, actions, filters } = useLoaderData<typeof loader>();
  const [permission] = usePermission({
    roleActions,
    actions,
  });
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  setUpToolbar(() => {
    return {
      titleToolbar: t("bankAccount"),
      ...(permission.create && {
        addNew: () => {
          navigate(
            route.toRoute({
              main: route.bankAccount,
              routeSufix: ["new"],
            })
          );
        },
      }),
    };
  }, [permission]);
  return (
    <DataLayout
      filterOptions={filters}
      fixedFilters={() => {
        return (
          <>
            <PartyTypeSearch />
            <PartySearch partyType={searchParams.get("party_type") || ""} />
          </>
        );
      }}
    >
      <DataTable
        data={results || []}
        columns={BankAccountColumns()}
        enableSizeSelection={true}
      />
    </DataLayout>
  );
}
