import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";
import User from "../models/User.js";
import uniqueUtility from "../utils/unique.js";
import authUtility from "../utils/auth.js";

// TODO Safe import data from user

const registerUser = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (
            (await uniqueUtility(User, "email", email)) ||
            (await uniqueUtility(User, "username", username))
        )
            return res.status(409).json({
                status: "failed",
                error: "Already registered",
            });
        await User.create({
            username: username,
            password: await bcrypt.hash(password, 10),
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
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.scope("withPassword").findOne({
            where: { username: username },
        });
        if (!(await authUtility.verifyUser(user, password))) {
            return res
                .status(401)
                .json({ status: "failed", error: "Invalid credentials" });
        }

        res.cookie(
            "refreshToken",
            authUtility.createRefreshToken(user.dataValues.id),
            {
                httpOnly: true,
                sameSite: "strict",
            }
        )
            .header(
                "Authorization",
                authUtility.createAccessToken(user.dataValues.id)
            )
            .json({
                status: "success",
                message: "Logged in",
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "failed", error: "Login failed" });
    }
};

const logoutUser = async (req, res) => {
    const refreshToken = req.cookies["refreshToken"];

    if (!refreshToken) {
        return res
            .status(401)
            .json({ status: "failed", message: "Token is required" });
    }

    try {
        return res
            .status(204)
            .cookie("refreshToken", "", {
                httpOnly: true,
                sameSite: "strict",
            })
            .header("Authorization", "")
            .send();
    } catch (error) {
        return res
            .status(500)
            .json({ status: "failed", error: "Logout failed" });
    }
};

const resfreshToken = async (req, res) => {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
        return res
            .status(401)
            .json({ status: "failed", error: "No refresh token" });
    }

    try {
        res.status(200)
            .header(
                "Authorization",
                authUtility.createAccessToken(
                    jwt.verify(refreshToken, process.env.SECRETKEY).userId
                )
            )
            .json({ status: "success" });
    } catch (error) {
        return res
            .status(400)
            .json({ status: "failed", error: "Invalid refresh token" });
    }
};

export default { registerUser, loginUser, logoutUser, resfreshToken };
