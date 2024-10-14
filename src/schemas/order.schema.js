import { z } from "zod";
import Order from "../models/order.js";

export const orderProductCreationSchema = z.object({
    ProductId: z.number().int().positive(),
    quantity: z.number().int().nonnegative(),
});

export const orderCreationSchema = z.object({
    products: z.array(orderProductCreationSchema).refine(
        (products) => {
            const productIds = products.map((product) => product.ProductId);
            const uniqueProductIds = new Set(productIds);
            return productIds.length === uniqueProductIds.size;
        },
        {
            message: "ProductId is not unique",
        }
    ),
});

export const orderUpdateSchema = z.object({
    status: z.enum(Order.getAttributes().status.values),
});
