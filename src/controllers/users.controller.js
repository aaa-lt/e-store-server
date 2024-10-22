import { getUserById, updateUserNameById } from "../services/user.service.js";
import { addSasToUrl } from "../utils/sas.utility.js";

export const getMyUser = async (req, res) => {
    try {
        if (req.user) {
            if (req.user.profileImageUrl) {
                req.user.profileImageUrl = addSasToUrl(
                    req.user.profileImageUrl
                );
            }

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

export const userUpdateNameController = async (req, res) => {
    try {
        if (req.body.name) {
            const resp = await updateUserNameById(req.user, req.body.name);

            return res.status(200).json({
                status: "success",
                message: "Name patched",
                user: resp,
            });
        }
        res.status(400).json({ status: "error", error: "No name provided" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ status: "error", error: "Patch failed" });
    }
};
