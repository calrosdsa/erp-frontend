import {
  useFetcher,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { action, loader } from "../route";
import DisplayTextValue from "@/components/custom/display/DisplayTextValue";
import { useTranslation } from "react-i18next";
import { Typography } from "@/components/typography";
import { route } from "~/util/route";
import FormLayout from "@/components/custom/form/FormLayout";
import { Form } from "@/components/ui/form";
import { LedgerAutocompleteFormField } from "~/util/hooks/fetchers/useAccountLedgerDebounceFethcer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AccountSettingData,
  accountSettingSchema,
} from "~/util/data/schemas/company/account-setting.schema";
import { GlobalState } from "~/types/app-types";
import { useEntityPermission, usePermission } from "~/util/hooks/useActions";
import { Entity } from "~/types/enums";
import { FieldRequiredType } from "~/util/data/schemas";
import { useSetupToolbarStore } from "~/util/hooks/ui/useSetUpToolbar";
import { useEffect, useRef } from "react";

export default function CompanyAccounts() {
  const { accountSettings, actions, company } = useLoaderData<typeof loader>();
  const { t } = useTranslation("common");
  const r = route;
  const form = useForm<AccountSettingData>({
    resolver: zodResolver(accountSettingSchema),
    defaultValues: {
      cash_account:{
        id:accountSettings?.cash_acct_id,
        name:accountSettings?.cash_acct,
        uuid:accountSettings?.cash_acct_uuid,
      },
      bank_account: {
        id: accountSettings?.bank_acct_id,
        name: accountSettings?.bank_acct,
        uuid: accountSettings?.bank_acct_uuid,
      },
      payable_account: {
        id: accountSettings?.payable_acct_id,
        name: accountSettings?.payable_acct,
        uuid: accountSettings?.payable_acct_uuid,
      },
      cost_of_good_sold_account: {
        id: accountSettings?.cost_of_goods_sold_acct_id,
        name: accountSettings?.cost_of_goods_sold_acct,
        uuid: accountSettings?.cost_of_goods_sold_acct_uuid,
      },
      receivable_account: {
        id: accountSettings?.receivable_acct_id,
        name: accountSettings?.receivable_acct,
        uuid: accountSettings?.receivable_acct_uuid,
      },
      income_account: {
        id: accountSettings?.income_acct_id,
        name: accountSettings?.income_acct,
        uuid: accountSettings?.income_acct_uuid,
      }
    },
  });

  const { roleActions } = useOutletContext<GlobalState>();
  const entityPermissions = useEntityPermission({
    entities: actions,
    roleActions,
  });
  const ledgerPerm = entityPermissions[Entity.LEDGER];
  const companyPerm = entityPermissions[Entity.COMPANY];
  const allowEdit = companyPerm?.edit;
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const onSubmit = (e: AccountSettingData) => {
    fetcher.submit({
      action: "edit-account-setting",
      accountSettingData: e,
    });
  };
  const formValues = form.getValues();
  const { setRegister } = useSetupToolbarStore();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const fieldsConfig = [
    {
      name: "bank_account",
      label: "Cuenta Bancaria",
    },
    {
      name: "cash_account",
      label: "Cuenta de Efectivo",
    },
    {
      name: "payable_account",
      label: "Cuenta a Pagar",
    },
    {
      name: "cost_of_good_sold_account",
      label: "Cuenta de Costos",
    },
    {
      name: "receivable_account",
      label: "Cuenta por Cobrar",
    },
    {
      name: "income_account",
      label: "Cuenta de Ingresos",
    },
  ];

  useEffect(() => {
    setRegister("tab", {
      onSave: () => inputRef.current?.click(),
      disabledSave: !allowEdit,
    });
  }, [allowEdit]);

  
  return (
    <FormLayout>
      <Form {...form}>
        <fetcher.Form
          onSubmit={form.handleSubmit(onSubmit)}
          className={"gap-y-3 grid p-3"}
        >
          <div className="create-grid">
            <Typography className=" col-span-full" variant="subtitle2">
              {t("f.join", { o: t("accounts"), p: t("settings") })}
            </Typography>
            {fieldsConfig.map(({ name, label }) => (
              <LedgerAutocompleteFormField
                key={name}
                allowEdit={allowEdit}
                control={form.control}
                name={name}
                label={label}
                {...(ledgerPerm?.create && {
                  addNew: () =>
                    navigate(
                      r.toRoute({
                        main: r.ledger,
                        routeSufix: ["new"],
                        q: {
                          redirect: location.pathname + location.search,
                        },
                      })
                    ),
                })}
                {...(ledgerPerm?.view && {
                  href: r.toRoute({
                    main: r.ledger,
                    routeSufix: [
                      (
                        formValues[
                          name as keyof AccountSettingData
                        ] as FieldRequiredType
                      )?.name || "",
                    ],
                    q: {
                      tab: "info",
                      id:
                        (
                          formValues[
                            name as keyof AccountSettingData
                          ] as FieldRequiredType
                        )?.uuid || "",
                    },
                  }),
                })}
              />
            ))}
          </div>
          <input ref={inputRef} type="submit" className="hidden" />
        </fetcher.Form>
      </Form>
    </FormLayout>
  );
}
