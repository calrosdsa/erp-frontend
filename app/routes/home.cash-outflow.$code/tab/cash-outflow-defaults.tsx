import DocAccounts from "@/components/custom/shared/document/tab/doc-accounts";
import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";

import { DocAccountsType } from "~/util/data/schemas/document/doc-accounts.schema";
import { GlobalState } from "~/types/app-types";
import { useEntityPermission, usePermission } from "~/util/hooks/useActions";
import { party } from "~/util/party";
import { Entity } from "~/types/enums";
import { loader } from "../route";
import { State, stateFromJSON } from "~/gen/common";

export default function CashOutflowDefaultsTab() {
  const { actions, docAccounts, entity, associatedActions } =
    useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  const [perm] = usePermission({ roleActions, actions });
  const status = stateFromJSON(entity?.status);
  const allowEdit = perm.edit && status == State.DRAFT;
  const partyType = party.cashOutflow;
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
            doc_id: entity?.id,
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
        showCreditAccount={true}
        showDebitAccount={true}
        allowEdit={allowEdit}
      />
    </>
  );
}
