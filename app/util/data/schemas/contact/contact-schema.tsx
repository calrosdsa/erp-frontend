import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { components } from "~/sdk";

export const createContactSchema = z
  .object({
    givenName: z
      .string()
      .min(DEFAULT_MIN_LENGTH)
      .max(DEFAULT_MAX_LENGTH)
      .optional(),
    familyName: z
      .string()
      .min(DEFAULT_MIN_LENGTH)
      .max(DEFAULT_MAX_LENGTH)
      .optional(),
    email: z.string().email().optional(),
    gender: z.string().optional(),
    phoneNumber: z.string().optional(),
    partyReferenceId: z.number().optional(),
  })
//   .superRefine((data, ctx) => {
//     if (data.givenName == undefined) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         params: {
//           i18n: { key: "custom.required" },
//         },
//         path: ["givenName"],
//       });
//     }
//   });

export const mapToContactData = (
  d?: z.infer<typeof createContactSchema>
): components["schemas"]["ContactData"] | undefined => {
  if (!d) return undefined;
  return {
    given_name: d.givenName || "",
    email: d.email,
    family_name: d.familyName,
    gender: d.gender,
    phone_number: d.phoneNumber,
  };
};
