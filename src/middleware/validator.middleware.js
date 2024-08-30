import { body } from "express-validator";
import { getUserByEmail, getUserByUsername } from "../services/user.service.js";
import { getCategory } from "../services/categories.service.js";
import {
    getSupplierByName,
    getSupplierByEmail,
    getSupplierByPhone,
} from "../services/suppliers.service.js";

export const validateNewUser = async (req, res, next) => {
    const validations = [
        body("username")
            .exists({ checkFalsy: true })
            .isString()
            .isLength({ min: 3 })
            .custom(async (value) => {
                try {
                    const user = await getUserByUsername(value);
                    if (user) {
                        throw new Error();
                    }
                } catch (error) {
                    if (error.message !== "User not found") {
                        throw new Error("Username already in use");
                    }
                }
            }),
        body("email")
            .notEmpty()
            .isEmail()
            .custom(async (value) => {
                try {
                    const user = await getUserByEmail(value);
                    if (user) {
                        throw new Error();
                    }
                } catch (error) {
                    if (error.message !== "User not found") {
                        throw new Error("Email already in use");
                    }
                }
            }),
        body("password").notEmpty().isString().isLength({ min: 8 }),
    ];
    for (const validation of validations) {
        const result = await validation.run(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
    }

    next();
};

export const validateNewCategory = async (req, res, next) => {
    const validations = [
        body("name")
            .exists({ checkFalsy: true })
            .isLength({ min: 3 })
            .custom(async (value) => {
                try {
                    const category = await getCategory(value);
                    if (category) {
                        throw new Error();
                    }
                } catch (error) {
                    if (error.message !== "Category not found") {
                        throw new Error("Category already in use");
                    }
                }
            }),
    ];
    for (const validation of validations) {
        const result = await validation.run(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
    }

    next();
};

export const validateNewSupplier = async (req, res, next) => {
    const validations = [
        body("name")
            .exists({ checkFalsy: true })
            .isLength({ min: 3 })
            .custom(async (value) => {
                try {
                    const supplier = await getSupplierByName(value);
                    if (supplier) {
                        throw new Error();
                    }
                } catch (error) {
                    if (error.message !== "Supplier not found") {
                        throw new Error("Supplier name already in use");
                    }
                }
            }),
        body("contact_email")
            .notEmpty()
            .isEmail()
            .custom(async (value) => {
                try {
                    const supplier = await getSupplierByEmail(value);
                    if (supplier) {
                        throw new Error();
                    }
                } catch (error) {
                    if (error.message !== "Supplier not found") {
                        throw new Error("Email already in use");
                    }
                }
            }),
        body("phone_number")
            .notEmpty()
            .isMobilePhone()
            .custom((value) => {
                if (!value.startsWith("+")) {
                    throw new Error("Invalid phone number");
                }
            })
            .custom(async (value) => {
                try {
                    const supplier = await getSupplierByPhone(value);
                    if (supplier) {
                        throw new Error();
                    }
                } catch (error) {
                    if (error.message !== "Supplier not found") {
                        throw new Error("Phone already in use");
                    }
                }
            }),
    ];
    for (const validation of validations) {
        const result = await validation.run(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
    }

    next();
};
