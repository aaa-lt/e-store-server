import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import { User } from "../models/indexModels.js";

const router = Router();

/**
 * @openapi
 * '/auth/register':
 *  post:
 *     tags:
 *     - Auth Controller
 *     summary: Create a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - username
 *              - email
 *              - password
 *            properties:
 *              username:
 *                type: string
 *                default: maxra0303
 *              email:
 *                type: string
 *                default: max@gmail.com
 *              password:
 *                type: string
 *                default: MaxTrust
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      500:
 *        description: Server Error
 */

router.post("/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const existingUsername = await User.findOne({
            where: { username: username },
        });
        const existingEmail = await User.findOne({
            where: { email: email },
        });
        if (existingUsername || existingEmail)
            return res.status(409).json({
                status: "failed",
                error: "Already registered",
            });
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username: username,
            password: hashedPassword,
            email: email,
        });
        res.status(201).json({
            status: "success",
            message: "User registered successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: "Registration failed",
        });
    }
});

/**
 * @openapi
 * '/auth/login':
 *  post:
 *     tags:
 *     - Auth Controller
 *     summary: Login as a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - username
 *              - password
 *            properties:
 *              username:
 *                type: string
 *                default: maxra0303
 *              password:
 *                type: string
 *                default: MaxTrust
 *     responses:
 *      200:
 *        description: Loggined in
 *      401:
 *        description: Authentication failed
 *      500:
 *        description: Server Error
 */

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.scope("withPassword").findOne({
            where: { username: username },
        });
        if (user === null) {
            return res.status(401).json({ error: "Authentication failed" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Authentication failed" });
        }
        const accessToken =
            "Bearer " +
            jwt.sign({ userId: user.dataValues.id }, process.env.SECRETKEY, {
                expiresIn: "1h",
            });
        const refreshToken = jwt.sign(
            { userId: user.dataValues.id },
            process.env.SECRETKEY,
            {
                expiresIn: "1d",
            }
        );
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "strict",
        })
            .header("Authorization", accessToken)
            .json({
                status: "success",
                message: "Logged in",
            });
    } catch (error) {
        res.status(500).json({ status: "failed", error: "Login failed" });
    }
});

/**
 * @openapi
 * '/auth/logout':
 *  post:
 *     tags:
 *     - Auth Controller
 *     summary: Logout the user
 *     security:
 *       - Authorization: []
 *     responses:
 *      204:
 *        description: Logged out
 *      400:
 *        description: Invalid token
 *      401:
 *        description: No token provided
 *      500:
 *        description: Server Error
 */

router.post("/logout", async (req, res) => {
    const accessToken = req.header("Authorization");
    const refreshToken = req.cookies["refreshToken"];

    if (!accessToken || !refreshToken) {
        return res
            .status(401)
            .json({ status: "failed", message: "Tokens are required" });
    }

    try {
        // TODO remove tokens from client

        res.status(204)
            .header("Authorization", accessToken)
            .json({ status: "success", message: decoded.userId });
    } catch (error) {
        return res
            .status(400)
            .json({ status: "failed", error: "Invalid token" });
    }
});

/**
 * @openapi
 * '/auth/refresh':
 *  post:
 *     tags:
 *     - Auth Controller
 *     summary: Refresh access token
 *     security:
 *       - Authorization: []
 *     responses:
 *      200:
 *        description: Created
 *      400:
 *        description: Invalid refresh token
 *      401:
 *        description: No token provided
 *      500:
 *        description: Server Error
 */

router.post("/refresh", async (req, res) => {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
        return res
            .status(401)
            .json({ status: "failed", error: "No refresh token" });
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.SECRETKEY);
        const accessToken = jwt.sign(
            { userId: decoded.userId },
            process.env.SECRETKEY,
            {
                expiresIn: "1h",
            }
        );
        res.status(200)
            .header("Authorization", accessToken)
            .json({ status: "success" });
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ status: "failed", error: "Invalid refresh token" });
    }
});

export default router;
