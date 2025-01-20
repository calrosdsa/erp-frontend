import { RefinementCtx, z } from "zod";

export const field = z.object({
  id: z.number().optional(),
  name: z.string().optional(),
  uuid: z.string().optional(),
});

export const fieldNull = z
  .object({
    id: z.number().optional().nullable(),
    name: z.string().optional().nullable(),
    uuid: z.string().optional().nullable(),
  })
  .optional()
  .nullable();

export const selectItemSchema = z.object({
  name:z.string(),
  value:z.string(),
})
// interface ValidateProps<T extends object, K extends keyof T> {
//   data: Record<string, boolean>;
//   ctx: RefinementCtx;
// }
interface ValidateProps {
  data: Record<string, boolean>;
  ctx: RefinementCtx;
}
export default function validateRequiredField({ data, ctx }: ValidateProps) {
  Object.entries(data).forEach(([key, value]) => {
    if (value) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: {
          i18n: { key: "custom.required" },
        },
        path: [key],
      });
    }
    // if (value?.[field] == undefined) {
    //   ctx.addIssue({
    //     code: z.ZodIssueCode.custom,
    //     params: {
    //       i18n: { key: "custom.required" },
    //     },
    //     path: [key],
    //   });
    // }
  });
}

// interface ValidateProps<T extends object, K extends keyof T> {
//   data: Record<string, T | undefined>
//   field: K
//   ctx: z.RefinementCtx
// }

// export default function validateRequiredField<T extends object, K extends keyof T>({
//   data,
//   field,
//   ctx,
// }: ValidateProps<T, K>): void {
//   const paths: string[] = Object.entries(data)
//     .filter(([_, value]) => value?.[field] == null)
//     .map(([key]) => key)

//   if (paths.length > 0) {
//     ctx.addIssue({
//       code: z.ZodIssueCode.custom,
//       message: `Field '${String(field)}' is required`,
//       path: paths,
//       params: {
//         i18n: { key: 'custom.required' },
//       },
//     })
//   }
// }
