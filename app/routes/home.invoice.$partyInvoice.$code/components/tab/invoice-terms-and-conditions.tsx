import AddressAndContact from "@/components/custom/shared/document/tab/address-and-contact";
import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import { loader } from "../../route";
import { GlobalState } from "~/types/app-types";
import { usePermission } from "~/util/hooks/useActions";
import { AddressAndContactDataType } from "~/util/data/schemas/document/address-and-contact.schema";
import DocTerms from "@/components/custom/shared/document/tab/doc-terms";
import { DocAccountsType } from "~/util/data/schemas/document/doc-accounts.schema";
import { DocTermsType } from "~/util/data/schemas/document/doc-terms.schema";

export default function InvoiceTermsAndConditionsTab() {
  const { actions,docTerms,invoice } = useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  const [orderPerm] = usePermission({ roleActions, actions });
  const allowEdit = orderPerm?.edit;
  const params = useParams()
  const partyType = params.partyInvoice || ""

  return (
    <>
    {/* {JSON.stringify(addressAndContact)} */}
    <DocTerms
      allowEdit={allowEdit}
      defaultValues={{
        doc_id:invoice?.id,
        doc_party_type:partyType,
        terms_and_condition:{
          id:docTerms?.terms_and_condition_id,
          name:docTerms?.terms_and_condition,
          uuid:docTerms?.terms_and_condition_uuid,
        },
        payment_term_template:{
          name:docTerms?.payment_term_template,
          id:docTerms?.payment_term_template_id,
          uuid:docTerms?.payment_term_template_uuid,
        }
    } as DocTermsType}

    />
    </>
  );
}
