import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Cloudinary configuration ek baar app start me
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (filepath) => {
  try {
    if (!filepath) {
      return null;
    }
    const uploadResult = await cloudinary.uploader.upload(filepath, { resource_type: 'auto' });
    fs.unlinkSync(filepath);  // local file delete karna
    return uploadResult.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;  // important: throw error taake calling function bhi handle kar sake
  }
};

export default uploadOnCloudinary;
