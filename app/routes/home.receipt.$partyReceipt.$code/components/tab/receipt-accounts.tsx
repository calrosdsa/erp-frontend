import DocAccounts from "@/components/custom/shared/document/tab/doc-accounts";
import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";

import { DocAccountsType } from "~/util/data/schemas/document/doc-accounts.schema";
import { GlobalState } from "~/types/app";
import { useEntityPermission, usePermission } from "~/util/hooks/useActions";
import { loader } from "../../route";
import { party } from "~/util/party";
import { Entity } from "~/types/enums";

export default function ReceiptAccountsTab() {
  const { actions, docAccounts, receipt, associatedActions } =
    useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  const [perm] = usePermission({ roleActions, actions });
  const allowEdit = perm?.edit;
  const params = useParams();
  const partyType = params.partyReceipt || "";
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
            doc_id: receipt?.id,
            doc_party_type: partyType,
            cogs_account: {
              id: docAccounts?.cogs_account_id,
              name: docAccounts?.cogs_account,
              uuid: docAccounts?.cogs_account_uuid,
            },
            inventory_account: {
              id: docAccounts?.inventory_account_id,
              name: docAccounts?.inventory_account,
              uuid: docAccounts?.inventory_account_uuid,
            },
            srbnb_account: {
              id: docAccounts?.srbnb_account_id,
              name: docAccounts?.srbnb_account,
              uuid: docAccounts?.srbnb_account_uuid,
            },
          } as DocAccountsType
        }
        showSrbnb={partyType == party.purchaseReceipt}
        showCogsAccount={partyType == party.deliveryNote}
        showInventoryAccount={true}
        ledgerPerm={ledgerPerm}
        allowEdit={allowEdit}
      />
    </>
  );
}
