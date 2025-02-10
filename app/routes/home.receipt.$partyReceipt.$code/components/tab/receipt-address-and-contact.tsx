import AddressAndContact from "@/components/custom/shared/document/tab/address-and-contact";
import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import { loader } from "../../route";
import { GlobalState } from "~/types/app";
import { useEntityPermission, usePermission } from "~/util/hooks/useActions";
import { AddressAndContactDataType } from "~/util/data/schemas/document/address-and-contact.schema";
import { route } from "~/util/route";
import { party } from "~/util/party";
import { Entity } from "~/types/enums";

export default function ReceiptAddressAndContactTab() {
  const { actions, addressAndContact, receipt, associatedActions } =
    useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  const [perm] = usePermission({ roleActions, actions });
  const allowEdit = perm?.edit;
  const params = useParams();
  const r = route;
  const partyType = params.partyReceipt || "";
  const entityPermissions = useEntityPermission({
    entities: associatedActions,
    roleActions,
  });
  const addressPerm = entityPermissions[Entity.ADDRESS];
  const contactPerm = entityPermissions[Entity.CONTACT];

  return (
    <>
      <AddressAndContact
        allowEdit={allowEdit}
        defaultValues={
          {
            id: receipt?.id,
            party_type: partyType,
            shipping_address: {
              id: addressAndContact?.shipping_address_id,
              name: addressAndContact?.shipping_address,
              uuid: addressAndContact?.shipping_address_uuid,
            },
            party_address: {
              id: addressAndContact?.party_address_id,
              name: addressAndContact?.party_address,
              uuid: addressAndContact?.party_address_uuid,
            },
          } as AddressAndContactDataType
        }
        showPartyrAddress={partyType == party.deliveryNote}
        showShippingAddress={partyType == party.purchaseReceipt}
        partyLabel={
          partyType == party.deliveryNote ? "Dirección del Cliente" : undefined
        }
        addressPerm={addressPerm}
        contactPerm={contactPerm}
      />
    </>
  );
}
