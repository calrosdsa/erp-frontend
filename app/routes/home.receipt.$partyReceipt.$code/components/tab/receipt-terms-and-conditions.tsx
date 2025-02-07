import AddressAndContact from "@/components/custom/shared/document/tab/address-and-contact";
import { useLoaderData, useOutletContext, useParams } from "@remix-run/react";
import { loader } from "../../route";
import { GlobalState } from "~/types/app";
import { useEntityPermission, usePermission } from "~/util/hooks/useActions";
import DocTerms from "@/components/custom/shared/document/tab/doc-terms";
import { DocTermsType } from "~/util/data/schemas/document/doc-terms.schema";
import { Entity } from "~/types/enums";

export default function ReceiptTermsAndConditionsTab() {
  const { actions,docTerms,receipt,associatedActions } = useLoaderData<typeof loader>();
  const { roleActions } = useOutletContext<GlobalState>();
  const [orderPerm] = usePermission({ roleActions, actions });
  const allowEdit = orderPerm?.edit;
  const params = useParams()
  const partyType = params.partyReceipt || "";
  const entityPermissions = useEntityPermission({
      entities: associatedActions,
      roleActions,
    });
    const paymentTermsTemplatePerm = entityPermissions[Entity.PAYMENT_TERMS_TEMPLATE];
    const termsAndConditionsPerm = entityPermissions[Entity.TERMS_AND_CONDITIONS];

  return (
    <>
    {/* {JSON.stringify(docTerms)} */}
    <DocTerms
      allowEdit={allowEdit}
      termsAndConditionsPerm={termsAndConditionsPerm}
      paymentTermsTemplatePerm={paymentTermsTemplatePerm}
      defaultValues={{
        doc_id:receipt?.id,
        doc_party_type:partyType,
        terms_and_conditions:{
          name:docTerms?.terms_and_condition,
          id:docTerms?.terms_and_condition_id,
          uuid:docTerms?.terms_and_condition_uuid,
        },
        payment_term_template:{
          name:docTerms?.payment_term_template,
          id:docTerms?.payment_term_template_id,
          uuid:docTerms?.payment_term_template_uuid
        },
    } as DocTermsType}

    />
    </>
  );
}
