import "dotenv/config";
import authUtility from "../utils/jwt.utility.js";
import { getUserByEmail, getUserByUsername } from "../services/user.service.js";
import {
    userLoginService,
    userRegisterService,
    tokenRefreshService,
    googleAuthService,
    githubAuthService,
} from "../services/auth.service.js";
import { OAuth2Client } from "google-auth-library";

const redirectURL = process.env.GOOGLE_REDIRECT_URI;
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
    const code = req.body.code;
    const provider = req.body.provider;

    try {
        if (!code || !provider) {
            return res
                .status(400)
                .json({ status: "error", message: "No data provided" });
        }
        const tokens = {};
        switch (provider) {
            case "google":
                const { tokens: credentials } = await client.getToken(code);
                const userInfoResponse = await googleAuthService(credentials);
                const { email, name } = userInfoResponse.data;
                const user = await getUserByEmail(email);

                if (user?.user_type === "regular") {
                    return res.status(409).json({
                        status: "error",
                        error: "User with this email is already exists",
                    });
                }
                if (!user) {
                    const newUser = {
                        username: email,
                        friendlyName: name,
                        email: email,
                        password: null,
                        userType: "google",
                        profileImageUrl: userInfoResponse.data.picture,
                    };
                    await userRegisterService(newUser);
                }
                tokens.access_token = credentials.access_token;
                tokens.refresh_token = credentials.refresh_token;
                tokens.expiry_date = credentials.expiry_date;
                break;
            case "github":
                console.log("AAA", code);
                const response = await githubAuthService(code);
                console.log(response);
                return res
                    .status(400)
                    .json({ status: "error", message: "Invalid provider" });

            default:
                return res
                    .status(400)
                    .json({ status: "error", message: "Invalid provider" });
        }
        if (tokens) {
            return res.status(200).json({
                tokens: {
                    accessToken: tokens.access_token,
                    refreshToken: tokens.refresh_token,
                    expiryDate: tokens.expiry_date,
                },
            });
        }
        return res.status(500).json({ status: "error", error: "Login failed" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: "error", error: "Login failed" });
    }
};

const googleRequestController = (req, res) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Referrer-Policy", "no-referrer-when-downgrade");

    const authorizeUrl = client.generateAuthUrl({
        access_type: "offline",
        scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email openid",
        prompt: "consent",
        state: JSON.stringify({ provider: "google" }),
    });

    res.json({ url: authorizeUrl });
};

export default {
    userRegisterController,
    userLoginController,
    resfreshAccessTokenController,
    socialLoginController,
    googleRequestController,
};
