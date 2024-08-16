import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import { User, BlacklistedToken } from "../models/indexModels.js";

const router = Router();

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
        const accessToken = jwt.sign(
            { userId: user.dataValues.id },
            process.env.SECRETKEY,
            {
                expiresIn: "1h",
            }
        );
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

router.post("/logout", async (req, res) => {
    const accessToken = req.header("Authorization");
    const refreshToken = req.cookies["refreshToken"];

    if (!accessToken || !refreshToken) {
        return res
            .status(401)
            .json({ status: "failed", message: "Tokens are required" });
    }

    try {
        const decodedAccess = jwt.verify(accessToken, process.env.SECRETKEY);
        const decodedRefresh = jwt.verify(refreshToken, process.env.SECRETKEY);

        await BlacklistedToken.create({
            token: accessToken,
            expiresAt: new Date(decodedAccess.exp * 1000),
        });
        await BlacklistedToken.create({
            token: accessToken,
            expiresAt: new Date(decodedRefresh.exp * 1000),
        });

        res.status(204)
            .header("Authorization", accessToken)
            .json({ status: "success", message: decoded.userId });
    } catch (error) {
        return res
            .status(400)
            .json({ status: "failed", error: "Invalid refresh token" });
    }
});

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
            .json({ status: "success", message: decoded.userId });
    } catch (error) {
        console.log(error);
        return res
            .status(400)
            .json({ status: "failed", error: "Invalid refresh token" });
    }
});

export default router;
