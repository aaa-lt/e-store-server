import { z } from "zod";

export const stringToIntPreprocessor = (val) => {
    if (typeof val === "string") {
        return parseFloat(val);
    }
    return val;
};

export const searchQuerySchema = z.object({
    name: z.string().min(2).optional(),
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
    pageSize: z.preprocess(stringToIntPreprocessor, z.number().positive()),
    page: z.preprocess(stringToIntPreprocessor, z.number().positive()),
});

export const getAllSchema = z.object({
    pageSize: z.preprocess(stringToIntPreprocessor, z.number().positive()),
    page: z.preprocess(stringToIntPreprocessor, z.number().positive()),
});
