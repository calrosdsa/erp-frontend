import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { fullName } from "~/util/convertor/convertor";
import { createContactSchema } from "~/util/data/schemas/contact/contact-schema";
import { routes } from "~/util/route";
import ContactCreateClient from "./contact-create";

type ActionData = {
  action: string;
  createContact: z.infer<typeof createContactSchema>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  const r = routes;
  let error: string | undefined = undefined;
  switch (data.action) {
    case "create-contact": {
      const d = data.createContact;
      console.log("CREATING CONTACT", d);
      const res = await client.POST("/party/contact", {
        body: {
          contact: {
            given_name: d.givenName || "",
            family_name: d.familyName,
            email: d.email,
            phone_number: d.phoneNumber,
            gender: d.gender,
          },
          party_reference: d.partyReferenceId,
        },
      });
      console.log(res.data, res.error);
      if (res.data) {
        const contact = res.data.result;
        return redirect(
          r.toContactDetail(
            fullName(contact.given_name, contact.family_name),
            contact.uuid
          )
        );
      }
      error = res.error?.detail;
      break;
    }
  }
  return json({
    error,
  });
};

export default function ContactCreate() {
  return <ContactCreateClient />;
}
