import { z } from "zod";

export const categoryCreationSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
});
