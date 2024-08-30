import jwt from "jsonwebtoken";
import "dotenv/config";
import authUtility from "../utils/auth.utility.js";
import { userCreateDTO, userVerifyDTO } from "../dto/user.dto.js";
import { createUser, verifyUser } from "../services/user.service.js";

const registerUser = async (req, res) => {
    try {
        await createUser(await userCreateDTO(req.body));
        res.status(201).json({
            status: "success",
            message: "User registered successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: "Registration failed",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const id = await verifyUser(await userVerifyDTO(req.body));
        if (!id) {
            return res
                .status(401)
                .json({ status: "error", error: "Invalid credentials" });
        }

        res.cookie("refreshToken", authUtility.createRefreshToken(id), {
            httpOnly: true,
            sameSite: "strict",
        })
            .header("Authorization", authUtility.createAccessToken(id))
            .json({
                status: "success",
                message: "Logged in",
            });
    } catch (error) {
        res.status(500).json({ status: "error", error: "Login failed" });
    }
};

const logoutUser = async (req, res) => {
    if (!req.cookies["refreshToken"]) {
        return res
            .status(401)
            .json({ status: "error", message: "Token is required" });
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
            .json({ status: "error", error: "Logout failed" });
    }
};

const resfreshToken = async (req, res) => {
    const refreshToken = req.cookies["refreshToken"];
    if (!refreshToken) {
        return res
            .status(401)
            .json({ status: "error", error: "No refresh token" });
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
            .json({ status: "error", error: "Invalid refresh token" });
    }
};

export default { registerUser, loginUser, logoutUser, resfreshToken };
