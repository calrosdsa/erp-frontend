import { ActionFunctionArgs, json, LoaderFunctionArgs } from "@remix-run/node";
import apiClient from "~/apiclient";
import { handleError } from "~/util/api/handle-status-code";
import ContactClient from "./contact.client";
import { z } from "zod";
import { ContactData, mapToContactData } from "~/util/data/schemas/contact/contact.schema";

type ActionData = {
  action: string;
  editContact: ContactData;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const client = apiClient({ request });
  const data = (await request.json()) as ActionData;
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  switch (data.action) {
    case "edit-contact": {
      const d = data.editContact;
      const res = await client.PUT("/party/contact", {
        body: mapToContactData(data.editContact)
      });
      error = res.error?.detail;
      message = res.data?.message;
      console.log(res.error)
      break;
    }
  }
  return json({
    error,
    message,
  });
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const client = apiClient({ request });
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const res = await client.GET("/party/contact/detail/{id}", {
    params: {
      path: {
        id: searchParams.get("id") || "",
      },
    },
  });
  handleError(res.error);
  return json({
    contact: res.data?.result.entity,
    activities:res.data?.result.activities,
    actions: res.data?.actions,
  });
};

export default function Contact() {
  return <ContactClient />;
}
