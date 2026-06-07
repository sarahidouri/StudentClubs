import { cloudinary } from '../config/cloudinary.js';

export const uploadImage = async (file, folder = 'studentclubs') => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: `studentclubs/${folder}`,
      resource_type: 'auto',
    });
    return result.secure_url;
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
};

export const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Delete image error:', error);
  }
};

export const uploadMultipleImages = async (files, folder = 'studentclubs') => {
  try {
    const results = await Promise.all(
      files.map((file) =>
        cloudinary.uploader.upload(file, {
          folder: `studentclubs/${folder}`,
          resource_type: 'auto',
        })
      )
    );
    return results.map((r) => r.secure_url);
  } catch (error) {
    throw new Error(`Multiple upload failed: ${error.message}`);
  }
};
