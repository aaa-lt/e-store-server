import { z } from "zod";
import { stringToIntPreprocessor } from "./pagination.schema.js";

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

export const getAllProductsSchema = z.object({
    sortBy: z
        .string()
        .regex(/^(-?)(category_id|supplier_id|price|creation_date)$/)
        .optional(),
    name: z.string().optional(),
    creationDate: z.string().date().optional(),
    minPrice: z.preprocess(
        stringToIntPreprocessor,
        z.number().nonnegative().optional()
    ),
    maxPrice: z.preprocess(
        stringToIntPreprocessor,
        z.number().nonnegative().optional()
    ),
    categoryName: z.string().min(2).optional(),
    supplierName: z.string().min(2).optional(),
    limit: z.preprocess(
        stringToIntPreprocessor,
        z.number().positive().optional()
    ),
    page: z.preprocess(
        stringToIntPreprocessor,
        z.number().positive().optional()
    ),
});
