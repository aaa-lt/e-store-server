import User from "../models/User.js";
import { passwordCompare, passwordHash } from "./bcrypt.service.js";
import authUtility from "../utils/auth.utility.js";
import jwt from "jsonwebtoken";

export const getUserById = async (id) => {
    const user = await User.findByPk(id);
    if (!user) {
        return undefined;
    }
    return user;
};

export const getUserByUsername = async (username) => {
    const user = await User.findOne({
        where: {
            username: username,
        },
    });
    if (!user) {
        return undefined;
    }
    return user;
};

export const getUserPasswordByUsername = async (username) => {
    const user = await User.scope("withPassword").findOne({
        where: {
            username: username,
        },
    });
    if (!user) {
        return undefined;
    }
    return user;
};

export const getUserByEmail = async (email) => {
    const user = await User.findOne({
        where: {
            email: email,
        },
    });
    if (!user) {
        return undefined;
    }
    return user;
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
