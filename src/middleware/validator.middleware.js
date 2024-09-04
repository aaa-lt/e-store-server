import { body, param } from "express-validator";
import { getUserByEmail, getUserByUsername } from "../services/user.service.js";
import {
    getCategory,
    getCategoryById,
} from "../services/categories.service.js";
import {
    getSupplierById,
    getSupplierByName,
    getSupplierByEmail,
    getSupplierByPhone,
} from "../services/suppliers.service.js";
import { getProductById } from "../services/products.service.js";
import { ZodError } from "zod";

export const validateData = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map((issue) => ({
                    message: `${issue.path.join(".")} is ${issue.message}`,
                }));
                res.status(400).json({
                    error: "Invalid data",
                    details: errorMessages,
                });
            } else {
                res.status(500).json({
                    error: "Zod Internal Server Error",
                });
            }
        }
    };
};

// export const validateNewUser = async (req, res, next) => {
//     const validations = [
//         body("username")
//             .exists({ checkFalsy: true })
//             .isString()
//             .isLength({ min: 3 })
//             .custom(async (value) => {
//                 try {
//                     const user = await getUserByUsername(value);
//                     if (user) {
//                         throw new Error();
//                     }
//                 } catch (error) {
//                     if (error.message !== "User not found") {
//                         throw new Error("Username already in use");
//                     }
//                 }
//             }),
//         body("email")
//             .notEmpty()
//             .isEmail()
//             .custom(async (value) => {
//                 try {
//                     const user = await getUserByEmail(value);
//                     if (user) {
//                         throw new Error();
//                     }
//                 } catch (error) {
//                     if (error.message !== "User not found") {
//                         throw new Error("Email already in use");
//                     }
//                 }
//             }),
//         body("password").notEmpty().isString().isLength({ min: 8 }),
//     ];
//     for (const validation of validations) {
//         const result = await validation.run(req);
//         if (!result.isEmpty()) {
//             return res.status(400).json({ errors: result.array() });
//         }
//     }

//     next();
// };

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

export const validateUpdateProduct = async (req, res, next) => {
    const validations = [
        param("id")
            .exists({ checkFalsy: true })
            .isInt()
            .custom(async (value) => {
                const product = await getProductById(value);
                if (product) {
                    return true;
                }
            }),
        body("name").optional().isString(),
        body("description").optional().isString(),
        body("quantity").optional().isInt(),
        body("price").optional().isInt(),
        body("category_id")
            .optional()
            .isInt()
            .custom(async (value) => {
                const category = await getCategoryById(value);
                if (category) {
                    return true;
                }
            }),
        body("supplier_id")
            .optional()
            .isInt()
            .custom(async (value) => {
                const supplier = await getSupplierById(value);
                if (supplier) {
                    return true;
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
