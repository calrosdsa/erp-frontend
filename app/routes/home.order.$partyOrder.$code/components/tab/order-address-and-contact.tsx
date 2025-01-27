import AddressAndContact from "@/components/custom/shared/document/tab/address-and-contact";
import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import { loader } from "../../route";
import { GlobalState } from "~/types/app";
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
        billing_address_id:addressAndContact?.billing_address_id,
        billing_address_name:addressAndContact?.billing_address,
        shipping_address_id:addressAndContact?.shipping_address_id,
        shipping_address_name:addressAndContact?.supplier_address,
        supplier_address_id:addressAndContact?.supplier_address_id,
        supplier_address_name:addressAndContact?.supplier_address,

    } as AddressAndContactDataType}
      showShippingAddress={true}
      showSupplierAddress={partyType == r.p.purchaseOrder}
      showBillingAddress={partyType == r.p.saleOrder}
    />
    </>
  );
}
