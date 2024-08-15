import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username: username,
            password: hashedPassword,
            email: email,
        });
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Registration failed" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ where: { username: username } });
        if (user === null) {
            return res.status(401).json({ error: "Authentication failed" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Authentication failed" });
        }
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.SECRETKEY,
            {
                expiresIn: "1h",
            }
        );
        const refreshToken = jwt.sign(
            { userId: user._id },
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
            .send("OK");
    } catch (error) {
        res.status(500).json({ error: "Login failed" });
    }
});

// TODO Fix refresh "req.cookies["refreshToken"];"

router.post("/refresh", async (req, res) => {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
        return res.status(401).send("No refresh token");
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.SECRETKEY);
        const accessToken = jwt.sign(
            { user: decoded.user },
            process.env.SECRETKEY,
            {
                expiresIn: "1h",
            }
        );

        res.header("Authorization", accessToken).send(decoded.user);
    } catch (error) {
        return res.status(400).send("Invalid refresh token");
    }
});

export default router;
