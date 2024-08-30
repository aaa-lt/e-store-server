import { body } from "express-validator";
import { getUserByEmail, getUserByUsername } from "../services/user.service.js";

export const validateNewUser = async (req, res, next) => {
    const validations = [
        body("username")
            .notEmpty()
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
        body("password").notEmpty().isLength({ min: 8 }),
    ];
    for (const validation of validations) {
        const result = await validation.run(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }
    }

    next();
};
