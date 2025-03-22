import DocAccounts from "@/components/custom/shared/document/tab/doc-accounts";
import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";

import { DocAccountsType } from "~/util/data/schemas/document/doc-accounts.schema";
import { GlobalState } from "~/types/app-types";
import { useEntityPermission, usePermission } from "~/util/hooks/useActions";
import { loader } from "../../route";
import { party } from "~/util/party";
import { Entity } from "~/types/enums";

export default function InvoiceAccountsTab() {
  const { actions, docAccounts, invoice,associatedActions } = useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  const [perm] = usePermission({ roleActions, actions });
  const allowEdit = perm?.edit;
  const params = useParams();
  const partyType = params.partyInvoice || "";
  const entityPermissions = useEntityPermission({
      entities: associatedActions,
      roleActions,
    });
    const ledgerPerm = entityPermissions[Entity.LEDGER];
  return (
    <>
      <DocAccounts
        defaultValues={
          {
            doc_id: invoice?.id,
            doc_party_type: partyType,
            credit_account: {
              id: docAccounts?.credit_account_id,
              name: docAccounts?.credit_account,
              uuid: docAccounts?.credit_account_uuid,
            },
            debit_account: {
              id: docAccounts?.debit_account_id,
              name: docAccounts?.debit_account,
              uuid: docAccounts?.debit_account_uuid,
            },
          } as DocAccountsType
        }
        ledgerPerm={ledgerPerm}
        showCreditAccount={partyType == party.purchaseInvoice}
        showDebitAccount={partyType == party.saleInvoice}

        allowEdit={allowEdit}
      />
    </>
  );
}
