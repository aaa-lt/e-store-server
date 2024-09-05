import { z } from "zod";

export const productCreationSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    quantity: z.number().positive().optional(),
    price: z.number().nonnegative().optional(),
    category_id: z.number().int().positive(),
    supplier_id: z.number().int().positive(),
});

export const productUpdateSchema = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    quantity: z.number().positive().finite().optional(),
    price: z.number().nonnegative().finite().optional(),
    category_id: z.number().int().positive().optional(),
    supplier_id: z.number().int().positive().optional(),
});
