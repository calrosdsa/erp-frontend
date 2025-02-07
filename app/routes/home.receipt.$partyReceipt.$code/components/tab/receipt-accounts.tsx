import DocAccounts from "@/components/custom/shared/document/tab/doc-accounts";
import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";

import { DocAccountsType } from "~/util/data/schemas/document/doc-accounts.schema";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { loader } from "../../route";
import { party } from "~/util/party";

export default function ReceiptAccountsTab() {
  const { actions, docAccounts, receipt } = useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  const [perm] = usePermission({ roleActions, actions });
  const allowEdit = perm?.edit;
  const params = useParams();

  const partyType = params.partyReceipt || "";
  return (
    <>
      <DocAccounts
        defaultValues={
          {
            doc_id: receipt?.id,
            doc_party_type: partyType,
            payable_account_id: docAccounts?.payable_account_id,
            payable_account: docAccounts?.payable_account,
            cogs_account_id: docAccounts?.cogs_account_id,
            cogs_account: docAccounts?.cogs_account,
            receivable_account_id: docAccounts?.receivable_account_id,
            receivable_account: docAccounts?.receivable_account,
            income_account_id: docAccounts?.income_account_id,
            income_account: docAccounts?.income_account,
            inventory_account_id: docAccounts?.inventory_account_id,
            inventory_account: docAccounts?.inventory_account,
            srbnb_account_id: docAccounts?.srbnb_account_id,
            srbnb_account: docAccounts?.srbnb_account,
          } as DocAccountsType
        }
        showSrbnb={partyType == party.purchaseReceipt}
        showCogsAccount={partyType == party.deliveryNote}
        showInventoryAccount={true}
        allowEdit={allowEdit}
      />
    </>
  );
}
