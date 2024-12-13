import User from "../models/user.js";
import { passwordCompare, passwordHash } from "./bcrypt.service.js";
import authUtility from "../utils/jwt.utility.js";
import jwt from "jsonwebtoken";
import axios from "axios";
import axiosRetry from "axios-retry";
import { getUserPasswordByUsername, getUserByEmail } from "./user.service.js";

const userRegisterService = async (reqBody) => {
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
        profileImageUrl: reqBody.profileImageUrl ?? null,
    });
    return user;
};

const userLoginService = async (reqBody) => {
    const user = await getUserPasswordByUsername(reqBody.username);
    if (!user) {
        return false;
    }
    if (await passwordCompare(reqBody.password, user.password)) {
        return user;
    }
};

const tokenRefreshService = (reqBody) => {
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

const socialUserLoginService = async (provider, userInfo) => {
    let user = await getUserByEmail(userInfo.email);

    if (!user) {
        const newUser = {
            username: userInfo.email,
            friendlyName: userInfo.name,
            email: userInfo.email,
            password: null,
            userType: provider,
            profileImageUrl: userInfo.picture,
        };
        user = await userRegisterService(newUser);
    }

    if (user.user_type != provider) {
        return;
    }

    return {
        access_token: authUtility.createRefreshToken(user.id),
        refresh_token: authUtility.createAccessToken(user.id),
    };
};

export {
    userRegisterService,
    userLoginService,
    tokenRefreshService,
    socialUserLoginService,
};
