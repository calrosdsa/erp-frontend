import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { fullName } from "~/util/convertor/convertor";
import { route } from "~/util/route";
import ContactCreateClient from "./contact-create";
import {
  contactDataSchema,
  mapToContactData,
} from "~/util/data/schemas/contact/contact.schema";

type ActionData = {
  action: string;
  createContact: z.infer<typeof contactDataSchema>;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  const r = route;
  let error: string | undefined = undefined;
  switch (data.action) {
    case "create-contact": {
      const d = data.createContact;
      console.log("CREATING CONTACT", d);
      const res = await client.POST("/party/contact", {
        body: mapToContactData(data.createContact),
      });
      console.log(res.data, res.error);
      if (res.data) {
        const contact = res.data.result;
        return redirect(
          r.toRouteDetail(r.contact, contact.name, {
            id: contact.id,
            tab: "info",
          })
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
