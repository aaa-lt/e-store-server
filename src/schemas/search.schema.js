import { z } from "zod";

export const searchQuerySchema = z.object({
    name: z.string().min(2).optional(),
    creationDate: z.string().date().optional(),
    minPrice: z.number().nonnegative().optional(),
    maxPrice: z.number().nonnegative().optional(),
    categoryName: z.string().min(2).optional(),
    supplierName: z.string().min(2).optional(),
});
