import { containerClient } from "../../config/azure.js";
import { nanoid } from "nanoid";
import { extname } from "path";
import sharp from "sharp";

export const uploadProfileImage = async (req, res) => {
    try {
        const { file } = req;

        if (!file) {
            return res.status(400).send("No file uploaded.");
        }

        if (req.user.profileImageUrl) {
            const oldBlobName = req.user.profileImageUrl.split("/").pop();
            const oldBlobClient =
                containerClient.getBlockBlobClient(oldBlobName);

            await oldBlobClient.deleteIfExists();
        }

        const blobName = nanoid() + extname(file.originalname);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        const resizedImageBuffer = await sharp(file.buffer)
            .resize(96, 96)
            .jpeg({ quality: 80 })
            .toBuffer();

        await blockBlobClient.uploadData(resizedImageBuffer);

        const profileImageUrl = blockBlobClient.url;

        const updatedUser = await req.user.update({ profileImageUrl });

        res.status(200).json({
            message: "Profile image uploaded successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error during profile image upload.");
    }
};
