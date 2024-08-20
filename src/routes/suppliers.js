import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";
import Supplier from "../models/Supplier.js";

const router = Router();

/**
 * @openapi
 * '/suppliers':
 *  get:
 *     tags:
 *     - Supplier Controller
 *     summary: Get product suppliers
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Server Error
 */

router.get("/", async (req, res) => {
    try {
        const suppliers = await Supplier.findAll();
        return res.status(200).send(suppliers);
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            error: "Failed to get information",
        });
    }
});

/**
 * @openapi
 * '/suppliers':
 *  post:
 *     tags:
 *     - Supplier Controller
 *     summary: Create a supplier
 *     security:
 *       - Authorization: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - user
 *            properties:
 *              name:
 *                type: string
 *                default: any
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      500:
 *        description: Server Error
 */

router.post("/", verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, contact_email, phone_number } = req.body;
        const existingName = await Supplier.findOne({
            where: { name: name },
        });

        if (existingName)
            return res.status(409).json({
                status: "failed",
                error: "Supplier with this name is already exists",
            });
        const existingEmail = await Supplier.findOne({
            where: { contact_email: contact_email },
        });

        if (existingEmail)
            return res.status(409).json({
                status: "failed",
                error: "Supplier with this email is already exists",
            });

        const existingNumber = await Supplier.findOne({
            where: { phone_number: phone_number },
        });
        if (existingNumber)
            return res.status(409).json({
                status: "failed",
                error: "Supplier with this phone is already exists",
            });

        await Supplier.create({
            name: name,
            contact_email: contact_email,
            phone_number: phone_number,
        });
        return res.status(201).json({
            status: "success",
            message: "Supplier created successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            error: "Creation failed",
        });
    }
});

export default router;
