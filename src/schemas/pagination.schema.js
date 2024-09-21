import { z } from "zod";

export const stringToIntPreprocessor = (val) => {
    if (typeof val === "string") {
        return parseFloat(val);
    }
    return val;
};

export const getAllSchema = z.object({
    limit: z.preprocess(
        stringToIntPreprocessor,
        z.number().positive().optional()
    ),
    page: z.preprocess(
        stringToIntPreprocessor,
        z.number().positive().optional()
    ),
});
