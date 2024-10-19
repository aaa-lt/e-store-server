import User from "../models/user.js";
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

export const updateUserNameById = async (user, friendlyName) => {
    return await user.update({ friendly_name: friendlyName });
};

export const userRegisterService = async (reqBody) => {
    const friendlyName = reqBody.friendlyName
        ? reqBody.friendlyName
        : reqBody.username;
    const userType = reqBody.userType ? reqBody.userType : "regular";

    const user = await User.create({
        username: reqBody.username,
        friendly_name: friendlyName,
        password: (await passwordHash(reqBody.password)) ?? null,
        email: reqBody.email,
        user_type: userType,
    });
    return user.id;
};

export const userLoginService = async (reqBody) => {
    const user = await getUserPasswordByUsername(reqBody.username);
    if (!user) {
        return false;
    }
    if (await passwordCompare(reqBody.password, user.password)) {
        return user.id;
    }
};

export const tokenRefreshService = (reqBody) => {
    const refreshToken = reqBody["refreshToken"].split(" ")[1];
    if (!refreshToken) {
        return undefined;
    }
    try {
        return authUtility.createAccessToken(
            jwt.verify(refreshToken, process.env.SECRETKEY).userId
        );
    } catch (error) {
        return undefined;
    }
};
