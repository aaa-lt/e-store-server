import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const User = sequelize.define(
    "User",
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        is_admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        user_type: {
            type: DataTypes.ENUM("regular", "google"),
            allowNull: false,
            defaultValue: "regular",
        },
        friendly_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        profileImageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        timestamps: false,
        defaultScope: {
            attributes: { exclude: ["password"] },
        },
        scopes: {
            withPassword: {
                attributes: {},
            },
        },
    }
);

export default User;
