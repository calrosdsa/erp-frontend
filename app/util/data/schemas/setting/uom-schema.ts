import { z } from "zod";
import { DEFAULT_MIN_LENGTH } from "~/constant";
import { components } from "~/sdk";


export const uomSchema = z.object({
    name:z.string().min(DEFAULT_MIN_LENGTH),
    code:z.string().min(DEFAULT_MIN_LENGTH),
})


export const uomDtoSchemaToUomDto = (
    d: z.infer<typeof uomSchema>
  ): components["schemas"]["UOMDto"] => {
    return {
      code: d.code,
      name: d.name,
    };
  };