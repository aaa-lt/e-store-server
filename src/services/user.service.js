import User from "../models/user.js";
import { passwordCompare, passwordHash } from "./bcrypt.service.js";
import authUtility from "../utils/jwt.utility.js";
import jwt from "jsonwebtoken";
import { getSASToken } from "../utils/sas.utility.js";

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

export const updateUserProfileById = async (user, fields) => {
    const updates = {};

    if (fields.name) updates.friendly_name = fields.name;
    if (fields.phone_number) updates.phone_number = fields.phone_number;
    if (fields.age) updates.age = fields.age;
    if (fields.delivery_address)
        updates.delivery_address = fields.delivery_address;
    if (typeof fields.newsletter_opt_in !== "undefined")
        updates.newsletter_opt_in = fields.newsletter_opt_in;

    return await user.update(updates);
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
        profileImageUrl: reqBody.profileImageUrl ?? null,
    });
    user.sasToken = getSASToken();
    return user;
};

export const userLoginService = async (reqBody) => {
    const user = await getUserPasswordByUsername(reqBody.username);
    if (!user) {
        return false;
    }
    if (await passwordCompare(reqBody.password, user.password)) {
        user.sasToken = getSASToken();
        return user;
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
