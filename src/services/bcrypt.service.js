import bcrypt from "bcryptjs";

export const passwordHash = async (password) => {
    if (password) {
        return bcrypt.hash(password, 10);
    }
    return undefined;
};

export const passwordCompare = async (password, userPassword) => {
    return bcrypt.compare(password, userPassword);
};
