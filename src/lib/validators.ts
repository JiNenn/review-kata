import * as z from "zod";

export const productInputSchema = z.object({
    name: z.string().trim().min(1).max(50), 
    price: z.number().int().min(0).max(1_000_000) 
});

export type ProductInput = z.infer<typeof productInputSchema>;

export const parseProductInput = (data: unknown): ProductInput => {
    return productInputSchema.parse(data);
}

export const safeParseProductInput = (
    data: unknown
) : z.SafeParseReturnType<unknown, ProductInput> => {
    return productInputSchema.safeParse(data);
}

export const productInputCoercedSchema = z.object({
  name: z.string().trim().min(1).max(50),
  price: z.coerce.number().int().min(0).max(1_000_000),
});
export type ProductInputCoerced = z.infer<typeof productInputCoercedSchema>;
export const safeCoerceProductInput = (
    data: unknown
) : z.SafeParseReturnType<unknown, ProductInputCoerced> => {
    return productInputCoercedSchema.safeParse(data);
}

export const makeProductInputSchemaWithReserved = (reserved: Iterable<string>) => {
  const set = reserved instanceof Set ? reserved : new Set(reserved);
  return productInputSchema.extend({
    name: z
      .string()
      .trim()
      .min(1)
      .max(50)
      .refine((n) => !set.has(n), { message: "name is reserved" }),
  });
};

