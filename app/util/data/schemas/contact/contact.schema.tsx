import { z } from "zod";
import { DEFAULT_MAX_LENGTH, DEFAULT_MIN_LENGTH } from "~/constant";
import { components } from "~/sdk";

export type ContactData = z.infer<typeof contactDataSchema>;
export type ContactBulkData = z.infer<typeof contactBulkDataSchema>;

export const contactDataSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(DEFAULT_MIN_LENGTH).max(DEFAULT_MAX_LENGTH),
  email: z.string().email().nullable().optional(),
  gender: z.string().nullable().optional(),
  phone_number: z.string().nullable().optional(),
  reference_id: z.number().optional(),
});

export const contactBulkDataSchema = z.object({
  contacts: z.array(contactDataSchema),
  party_id: z.number(),
});

export const mapToContactBulkData = (e: ContactBulkData) => {
  const d: components["schemas"]["ContactBulkData"] = {
    contacts: e.contacts.map((t) => mapToContactData(t)),
    party_id: e.party_id,
  };
  return d;
};

export const mapToContactData = (e: ContactData) => {
  const d: components["schemas"]["ContactData"] = {
    fields: {
      email: e.email,
      gender: e.gender,
      name: e.name,
      phone_number: e.phone_number,
    },
    reference_id: e.reference_id,
    id: e.id,
  };
  return d;
};


export const mapToContactSchema = (e:components["schemas"]["ContactDto"]) =>{
  const d:ContactData = {
    id:e.id,
    name: e.name,
    email:e.email,
    phone_number:e.phone_number,
  }
  return d
}