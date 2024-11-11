import User from "../models/user.js";

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
