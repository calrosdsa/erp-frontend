import { ActionFunctionArgs, json } from "@remix-run/node";
import { z } from "zod";
import apiClient from "~/apiclient";
import { components } from "~/sdk";
import { createChargesTemplateSchema } from "~/util/data/schemas/accounting/charges-template-schema";
import { mapToTaxAndChargeData } from "~/util/data/schemas/accounting/tax-and-charge-schema";
import NewChargesTemplateClient from "./new-charges-template";

type ActionData = {
  action: string;
  createChargesTemplate: z.infer<typeof createChargesTemplateSchema>;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const data = (await request.json()) as ActionData;
  const client = apiClient({ request });
  let message: string | undefined = undefined;
  let error: string | undefined = undefined;
  let chargesTemplate: components["schemas"]["ChargesTemplateDto"] | undefined =
    undefined;
  switch (data.action) {
    case "create-charges-template": {
      const d = data.createChargesTemplate;
      const taxLines = d.taxLines.map((t) => mapToTaxAndChargeData(t));
      const res = await client.POST("/charge-template", {
        body: {
          charges_template: {
            name: d.name,
          },
          tax_and_charges: {
            lines: taxLines,
          },
        },
      });
      message = res.data?.message;
      error = res.error?.detail;
      chargesTemplate = res.data?.result;
      break;
    }
  }
  return json({
    message,
    error,
    chargesTemplate,
  });
};

export default function NewChargesTemplate() {
  return <NewChargesTemplateClient />;
}
