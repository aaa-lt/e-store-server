import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { passwordCompare } from "../services/bcrypt.service.js";
import "dotenv/config";

const verifyUser = async (user, pass) => {
    try {
        return !(
            user === null || !(await passwordCompare(pass, user.password))
        );
    } catch (error) {
        throw error;
    }
};

const createAccessToken = (userId) => {
    return (
        "Bearer " +
        jwt.sign({ userId: userId }, process.env.SECRETKEY, {
            expiresIn: "1h",
        })
    );
};

const createRefreshToken = (userId) => {
    return jwt.sign({ userId: userId }, process.env.SECRETKEY, {
        expiresIn: "1d",
    });
};

export default { verifyUser, createAccessToken, createRefreshToken };
