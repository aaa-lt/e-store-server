import "dotenv/config";
import authUtility from "../utils/jwt.utility.js";
import {
    userRegisterService,
    userLoginService,
    getUserByEmail,
    getUserByUsername,
} from "../services/user.service.js";

const userRegisterController = async (req, res) => {
    try {
        if (
            (await getUserByUsername(req.body.username)) ||
            (await getUserByEmail(req.body.email))
        ) {
            return res.status(409).send("Duplicate found");
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
        console.log(error);
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
        res.status(500).json({ status: "error", error: "Login failed" });
    }
};

const userLogoutController = async (req, res) => {
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

export default {
    userRegisterController,
    userLoginController,
    userLogoutController,
};
