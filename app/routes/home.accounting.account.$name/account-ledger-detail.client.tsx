import { useLoaderData } from "@remix-run/react";
import { loader } from "./route";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { routes } from "~/util/route";
import { useTranslation } from "react-i18next";
import { formatLongDate } from "~/util/format/formatDate";
import { setUpToolbar } from "~/util/hooks/ui/useSetUpToolbar";
import { stateFromJSON } from "~/gen/common";

export default function AccountLedgerDetailClient() {
  const { actions, accountDetail } = useLoaderData<typeof loader>();
  const r = routes;
  const { t, i18n } = useTranslation("common");
  setUpToolbar(() => {
    return {
      status: stateFromJSON(accountDetail?.status),
    };
  }, []);
  return (
    <div>
      <div className=" info-grid">
        <DisplayTextValue title={t("form.name")} value={accountDetail?.name} />
        <DisplayTextValue
          title={t("f.parent", { o: t("_ledger.base") })}
          value={accountDetail?.parent_name}
          to={r.toAccountLedgerDetail(
            accountDetail?.parent_name,
            accountDetail?.parent_uuid
          )}
        />
        <DisplayTextValue
          title={t("_ledger.type")}
          value={t(accountDetail?.account_type || "")}
        />
        <DisplayTextValue
          title={t("form.isGroup")}
          value={accountDetail?.is_group}
        />
        <DisplayTextValue
          title={t("form.enabled")}
          value={accountDetail?.enabled}
        />
        <DisplayTextValue
          title={t("_ledger.no")}
          value={accountDetail?.ledger_no}
        />
        <DisplayTextValue
          title={t("form.description")}
          value={accountDetail?.description}
        />
        <DisplayTextValue
          title={t("table.createdAt")}
          value={formatLongDate(accountDetail?.created_at, i18n.language)}
        />
      </div>
    </div>
  );
}
