import { z } from "zod";

const phoneRegex = new RegExp(
    "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$"
);

export const supplierCreationSchema = z.object({
    name: z.string().min(2),
    phone_number: z.string().regex(phoneRegex),
    contact_email: z.string().email(),
});
