import {
    getUserById,
    updateUserProfileById,
} from "../services/user.service.js";
import { getSASToken } from "../utils/sas.utility.js";

export const getMyUser = async (req, res) => {
    try {
        if (req.user) {
            req.user.dataValues.sasToken = getSASToken();

            return res.status(200).send(req.user);
        }

        res.status(404).send("User not found");
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "error",
            error: error.message,
        });
    }
};
export const getUser = async (req, res) => {
    try {
        const user = await getUserById(req.params.id);
        res.status(200).send(user);
    } catch (error) {
        res.status(404).json({
            status: "error",
            error: error.message,
        });
    }
};

export const userUpdateProfileController = async (req, res) => {
    try {
        const { name, phone_number, age, delivery_address, newsletter_opt_in } =
            req.body;

        if (
            !name &&
            !phone_number &&
            !age &&
            !delivery_address &&
            typeof newsletter_opt_in === "undefined"
        ) {
            return res.status(400).json({
                status: "error",
                error: "No fields provided for update",
            });
        }

        const updatedUser = await updateUserProfileById(req.user, {
            name,
            phone_number,
            age,
            delivery_address,
            newsletter_opt_in,
        });

        return res.status(200).json({
            status: "success",
            message: "Profile updated",
            user: updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: "Patch failed" });
    }
};
