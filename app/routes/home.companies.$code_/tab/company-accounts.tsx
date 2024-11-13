import { useLoaderData } from "@remix-run/react";
import { loader } from "../route";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useTranslation } from "react-i18next";
import { Typography } from "@/components/typography";
import { routes } from "~/util/route";

export default function CompanyAccounts() {
  const { accountSettings } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const r = routes;
  const toAccount = (name?: string, uuid?: string) => {
    return r.toRoute({
      main: r.accountM,
      routePrefix: [r.accountingM],
      routeSufix: [name || ""],
      q: {
        tab: "info",
        id: uuid,
      },
    });
  };
  return (
    <div>
      <div className="info-grid">
        <Typography className=" col-span-full" variant="subtitle2">
          {t("f.join", { o: t("accounts"), p: t("settings") })}
        </Typography>
        <DisplayTextValue
          title={t("f.default", { o: t("accountType.cash"), p: t("account") })}
          value={accountSettings?.cash_acct_name}
          to={toAccount(
            accountSettings?.cash_acct_name,
            accountSettings?.cash_acct_uuid
          )}
        />
        <DisplayTextValue
          title={t("f.default", { o: t("accountType.bank"), p: t("account") })}
          value={accountSettings?.bank_acct_name}
          to={toAccount(
            accountSettings?.bank_acct_name,
            accountSettings?.bank_acct_uuid
          )}
        />
        <DisplayTextValue
          title={t("f.default", {
            o: t("accountType.payable"),
            p: t("account"),
          })}
          value={accountSettings?.payable_acct_name}
          to={toAccount(
            accountSettings?.payable_acct_name,
            accountSettings?.payable_acct_uuid
          )}
        />
        <DisplayTextValue
          title={t("f.default", {
            o: t("accountType.receivable"),
            p: t("account"),
          })}
          value={accountSettings?.receivable_acct_name}
          to={toAccount(
            accountSettings?.receivable_acct_name,
            accountSettings?.receivable_acct_uuid
          )}
        />
        <DisplayTextValue
          title={t("f.default", {
            o: t("accountType.income"),
            p: t("account"),
          })}
          value={accountSettings?.income_acct_name}
          to={toAccount(
            accountSettings?.income_acct_name,
            accountSettings?.income_acct_uuid
          )}
        />
        <DisplayTextValue
          title={t("f.default", {
            o: t("accountType.costOfGoodSolds"),
            p: t("account"),
          })}
          value={accountSettings?.cost_of_goods_sold_acct_name}
          to={toAccount(
            accountSettings?.cost_of_goods_sold_acct_name,
            accountSettings?.cost_of_goods_sold_acct_uuid
          )}
        />
      </div>
    </div>
  );
}
