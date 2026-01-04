import { v2 as cloudinary } from 'cloudinary'
import fs from "fs"

const uloadOnCloudinary = async (filePath) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  if (!filePath) throw new Error('No file path provided to upload')

  try {
    const result = await cloudinary.uploader.upload(filePath)
    try { fs.unlinkSync(filePath) } catch (e) {}
    return result.secure_url
  } catch (err) {
    try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath) } catch (e) {}
    console.error('cloudinary upload error', err)
    throw err
  }
}

export default uloadOnCloudinary