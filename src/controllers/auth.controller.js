import "dotenv/config";
import authUtility from "../utils/jwt.utility.js";
import {
    getUserByEmail,
    getUserByUsername,
    userLoginService,
    userRegisterService,
    tokenRefreshService,
} from "../services/user.service.js";

const userRegisterController = async (req, res) => {
    try {
        if (await getUserByUsername(req.body.username)) {
            return res.status(409).json({
                status: "error",
                source: "username",
                error: "User with this Username is already exists",
            });
        }
        if (await getUserByEmail(req.body.email)) {
            return res.status(409).json({
                status: "error",
                source: "email",
                error: "User with this Email is already exists",
            });
        }
        const id = await userRegisterService(req.body);
        const accessToken = authUtility.createRefreshToken(id);
        const refreshToken = authUtility.createAccessToken(id);

        res.status(201)
            .cookie("refreshToken", accessToken, {
                httpOnly: true,
                sameSite: "strict",
            })
            .header("Authorization", refreshToken)
            .json({
                status: "success",
                message: "User registered successfully",
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: "Registration failed",
        });
    }
};

const userLoginController = async (req, res) => {
    try {
        const id = await userLoginService(req.body);
        if (!id) {
            return res
                .status(401)
                .json({ status: "error", error: "Invalid credentials" });
        }

        const accessToken = authUtility.createRefreshToken(id);
        const refreshToken = authUtility.createAccessToken(id);

        res.cookie("refreshToken", accessToken, {
            httpOnly: true,
            sameSite: "strict",
        })
            .header("Authorization", refreshToken)
            .json({
                status: "success",
                message: "Logged in",
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: "Login failed" });
    }
};

const resfreshAccessTokenController = async (req, res) => {
    if (!req.cookies["refreshToken"]) {
        return res
            .status(401)
            .json({ status: "error", message: "Token is required" });
    }

    try {
        const accessToken = tokenRefreshService(req.body);
        if (!accessToken) {
            return res
                .status(401)
                .json({ status: "error", message: "Invalid Token" });
        }
        return res
            .status(200)
            .json({ status: "success", accessToken: accessToken });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ status: "error", error: "Refresh failed" });
    }
};

export default {
    userRegisterController,
    userLoginController,
    resfreshAccessTokenController,
};
