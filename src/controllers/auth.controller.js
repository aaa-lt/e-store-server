import "dotenv/config";
import authUtility from "../utils/jwt.utility.js";
import { getUserByEmail, getUserByUsername } from "../services/user.service.js";
import {
    userLoginService,
    userRegisterService,
    tokenRefreshService,
    socialUserLoginService,
} from "../services/auth.service.js";
import { OAuth2Client } from "google-auth-library";
import SocialStrategyFactory from "../factories/socialStrategyFactory.js";

const redirectURL = process.env.REDIRECT_URI;
const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectURL
);

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
        const user = await userRegisterService(req.body);
        const accessToken = authUtility.createRefreshToken(user.id);
        const refreshToken = authUtility.createAccessToken(user.id);

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
                user: user,
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            error: "Registration failed",
        });
    }
};

const userLoginController = async (req, res) => {
    try {
        const user = await userLoginService(req.body);
        if (!user) {
            return res
                .status(401)
                .json({ status: "error", error: "Invalid credentials" });
        }

        const accessToken = authUtility.createRefreshToken(user.id);
        const refreshToken = authUtility.createAccessToken(user.id);

        res.json({
            status: "success",
            message: "Logged in",
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: "Login failed" });
    }
};

const resfreshAccessTokenController = async (req, res) => {
    if (!req.body.refreshToken) {
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

const socialLoginController = async (req, res) => {
    const { code, provider } = req.body;

    try {
        if (!code || !provider) {
            return res
                .status(400)
                .json({ status: "error", message: "No data provided" });
        }

        const strategy = SocialStrategyFactory.getStrategy(req.body.provider);
        const userInfo = await strategy.getUserInfo(code);
        const tokens = await socialUserLoginService(provider, userInfo);

        if (!tokens) {
            return res.status(409).json({
                status: "error",
                error: "User with this email already exists",
            });
        }

        return res.status(200).json({
            tokens: {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
            },
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", error: "Login failed" });
    }
};

const socialRequestController = (req, res) => {
    try {
        const strategy = SocialStrategyFactory.getStrategy(req.query.provider);
        const url = strategy.getAuthorizationUrl();

        return res.status(200).json({ url });
    } catch (error) {
        return res.status(400).send("Invalid provider");
    }
};

export default {
    userRegisterController,
    userLoginController,
    resfreshAccessTokenController,
    socialLoginController,
    socialRequestController,
};
