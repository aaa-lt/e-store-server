import User from "../models/User.js";
import { passwordCompare, passwordHash } from "./bcrypt.service.js";
import authUtility from "../utils/jwt.utility.js";
import jwt from "jsonwebtoken";

export const getUserById = async (id) => {
    return await User.findByPk(id);
};

export const getUserByUsername = async (username) => {
    return await User.findOne({
        where: {
            username: username,
        },
    });
};

export const getUserPasswordByUsername = async (username) => {
    return await User.scope("withPassword").findOne({
        where: {
            username: username,
        },
    });
};

export const getUserByEmail = async (email) => {
    return await User.findOne({
        where: {
            email: email,
        },
    });
};

export const userRegisterService = async (reqBody) => {
    const user = await User.create({
        username: reqBody.username,
        password: await passwordHash(reqBody.password),
        email: reqBody.email,
    });
    return user.id;
};

export const userLoginService = async (reqBody) => {
    try {
        const user = await getUserPasswordByUsername(reqBody.username);
        if (await passwordCompare(reqBody.password, user.password)) {
            return user.id;
        }
    } catch (error) {
        if (error.message === "User not found") {
            return false;
        }
        throw error;
    }
};

export const tokenRefreshService = (reqCookies) => {
    const refreshToken = reqCookies["refreshToken"];
    if (!refreshToken) {
        return undefined;
    }
    return authUtility.createAccessToken(
        jwt.verify(refreshToken, process.env.SECRETKEY).userId
    );
};
