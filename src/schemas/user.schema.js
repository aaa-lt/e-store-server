import { z } from "zod";

export const userRegistrationSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(8),
    email: z.string().email(),
});

export const userLoginSchema = z.object({
    username: z.string().min(3),
    password: z.string().min(8),
});
