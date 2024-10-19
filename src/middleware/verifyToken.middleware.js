import jwt from "jsonwebtoken";
import "dotenv/config";
import axios from "axios";
import { getUserByEmail, getUserById } from "../services/user.service.js";

const verifyToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization").split(" ")[1];
        if (!token) return res.status(401).json({ error: "Access denied" });

        if (isRegularJWT(token)) {
            const decoded = jwt.verify(token, process.env.SECRETKEY);
            req.user = await getUserById(decoded.userId);
            return next();
        }

        const googleUserInfo = await verifyGoogleToken(token);
        req.user = await getUserByEmail(googleUserInfo.email);

        next();
    } catch (error) {
        return res
            .status(401)
            .json({ status: "error", error: "Invalid access token" });
    }
};

const isRegularJWT = (token) => {
    const parts = token.split(".");
    return parts.length === 3;
};

const verifyGoogleToken = async (token) => {
    try {
        const response = await axios.get(
            `https://oauth2.googleapis.com/tokeninfo?access_token=${token}`
        );
        return response.data;
    } catch (error) {
        throw new Error("Invalid Google access token");
    }
};

export default verifyToken;
