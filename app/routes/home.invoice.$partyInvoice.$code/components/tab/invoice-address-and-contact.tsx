import AddressAndContact from "@/components/custom/shared/document/tab/address-and-contact";
import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import { loader } from "../../route";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { AddressAndContactDataType } from "~/util/data/schemas/document/address-and-contact.schema";
import { route } from "~/util/route";

export default function InvoiceAddressAndContactTab() {
  const { actions,addressAndContact,invoice } = useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  const [perm] = usePermission({ roleActions, actions });
  const allowEdit = perm?.edit;
  const params = useParams()
  const r = route
  const partyType = params.partyInvoice || ""

  return (
    <>
    {/* {JSON.stringify(addressAndContact)} */}
    <AddressAndContact
      allowEdit={allowEdit}
      defaultValues={{
        id:invoice?.id,
        party_type:partyType,
        billing_address_id:addressAndContact?.billing_address_id,
        billing_address_name:addressAndContact?.billing_address,
        shipping_address_id:addressAndContact?.shipping_address_id,
        shipping_address_name:addressAndContact?.shipping_address,
        party_address_id:addressAndContact?.party_address_id,
        party_address_name:addressAndContact?.party_address,

    } as AddressAndContactDataType}
      // showShippingAddress={true}
      showPartyrAddress={partyType == r.p.purchaseInvoice}
      showBillingAddress={true}
      partyLabel={partyType == r.p.purchaseInvoice ? "Dirección de Proveedor" : "Dirección del Cliente"}
    />
    </>
  );
}
