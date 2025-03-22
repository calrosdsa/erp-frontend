import AddressAndContact from "@/components/custom/shared/document/tab/address-and-contact";
import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import { loader } from "../../route";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { AddressAndContactDataType } from "~/util/data/schemas/document/address-and-contact.schema";
import { route } from "~/util/route";

export default function OrderAddressAndContactTab() {
  const { actions,addressAndContact,order } = useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  const [orderPerm] = usePermission({ roleActions, actions });
  const allowEdit = orderPerm?.edit;
  const params = useParams()
  const r = route
  const partyType = params.partyOrder || ""

  return (
    <>
    {/* {JSON.stringify(addressAndContact)} */}
    <AddressAndContact
      allowEdit={allowEdit}
      defaultValues={{
        id:order?.id,
        party_type:partyType,
        billing_address:{
          name:addressAndContact?.billing_address,  
          id:addressAndContact?.billing_address_id,
          uuid:addressAndContact?.billing_address_uuid,
        },
        shipping_address:{
          id:addressAndContact?.shipping_address_id,
          name:addressAndContact?.shipping_address,
          uuid:addressAndContact?.shipping_address_uuid
        },
        party_address:{
          id:addressAndContact?.party_address_id,
          name:addressAndContact?.party_address,
          uuid:addressAndContact?.party_address_uuid
        }
    } as AddressAndContactDataType}
      showShippingAddress={true}
      showPartyrAddress={partyType == r.p.purchaseOrder}
      showBillingAddress={partyType == r.p.saleOrder}
      partyLabel={partyType == r.p.purchaseOrder ? "Dirección de Proveedor":""}
    />
    </>
  );
}
