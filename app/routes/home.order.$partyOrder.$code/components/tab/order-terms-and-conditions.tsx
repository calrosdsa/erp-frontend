import AddressAndContact from "@/components/custom/shared/document/tab/address-and-contact";
import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import { loader } from "../../route";
import { GlobalState } from "~/types/app";
import { usePermission } from "~/util/hooks/useActions";
import { AddressAndContactDataType } from "~/util/data/schemas/document/address-and-contact.schema";
import { route } from "~/util/route";
import DocTerms from "@/components/custom/shared/document/tab/doc-terms";
import { DocAccountsType } from "~/util/data/schemas/document/doc-accounts.schema";
import { DocTermsType } from "~/util/data/schemas/document/doc-terms.schema";

export default function OrderTermsAndConditionsTab() {
  const { actions,docTerms,order } = useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  const [orderPerm] = usePermission({ roleActions, actions });
  const allowEdit = orderPerm?.edit;
  const params = useParams()
  const r = route
  const partyType = params.partyOrder || ""

  return (
    <>
    {/* {JSON.stringify(addressAndContact)} */}
    <DocTerms
      allowEdit={allowEdit}
      defaultValues={{
        doc_id:order?.id,
        doc_party_type:partyType,
        terms_and_conditions_id:docTerms?.terms_and_condition_id,
        terms_and_conditions:docTerms?.terms_and_condition,
        payment_term_template:docTerms?.payment_term_template,
        payment_term_template_id:docTerms?.payment_term_template_id,
    } as DocTermsType}

    />
    </>
  );
}
