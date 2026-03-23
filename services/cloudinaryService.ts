import cloudinary from "../config/cloudinary.js";

class CloudinaryService {

    async uploadImage(filePath: string) {

        const result = await cloudinary.uploader.upload(filePath, {
            folder: "projects"
        });

        return {
            url: result.secure_url,
            publicId: result.public_id
        };
    }


    async deleteImage(publicId: string) {
        await cloudinary.uploader.destroy(publicId);
    }

}

export default new CloudinaryService();