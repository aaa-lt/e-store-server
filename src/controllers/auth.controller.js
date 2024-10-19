import "dotenv/config";
import authUtility from "../utils/jwt.utility.js";
import {
    getUserByEmail,
    getUserByUsername,
    userLoginService,
    userRegisterService,
    tokenRefreshService,
} from "../services/user.service.js";
import { OAuth2Client } from "google-auth-library";

const redirectURL = "http://127.0.0.1:8000/oauth/callback";
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

const googleLoginController = async (req, res) => {
    const code = req.query.code;

    try {
        const { tokens } = await client.getToken(code);
        return res.status(200).json({
            tokens: {
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
            },
        });
    } catch (err) {
        console.log("Error logging in with OAuth2 user", err);
        res.status(400).json({ test: "test" });
    }
};

const googleRequestController = (req, res) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Referrer-Policy", "no-referrer-when-downgrade");

    const authorizeUrl = client.generateAuthUrl({
        access_type: "offline",
        scope: "https://www.googleapis.com/auth/userinfo.profile openid",
        prompt: "consent",
    });

    res.json({ url: authorizeUrl });
};

export default {
    userRegisterController,
    userLoginController,
    resfreshAccessTokenController,
    googleLoginController,
    googleRequestController,
};
