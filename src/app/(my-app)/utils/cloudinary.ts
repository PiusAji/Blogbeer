// utils/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

// Function to ensure Cloudinary is configured
const ensureCloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export const uploadToCloudinary = async (
  file: Buffer,
  filename: string,
  folder: string = "payload-uploads"
): Promise<{ url: string; public_id: string }> => {
  // Ensure configuration is set before upload
  ensureCloudinaryConfig();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: `${folder}/${filename.split(".")[0]}`, // Remove extension and add folder structure
        resource_type: "auto", // Automatically detect file type
        overwrite: true,
        // Add transformations for optimization
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
          });
        }
      }
    );

    // Handle the buffer stream
    const bufferStream = Readable.from(file);
    bufferStream.pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  ensureCloudinaryConfig();

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary delete result:", result);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

// Helper function to get Cloudinary URL with transformations
export const getCloudinaryUrl = (
  publicId: string,
  transformations?: Record<string, string | number>[]
) => {
  if (!publicId) return null;

  ensureCloudinaryConfig();

  return cloudinary.url(publicId, {
    secure: true,
    transformation: transformations || [
      { quality: "auto", fetch_format: "auto" },
    ],
  });
};

// Helper to generate responsive image URLs
export const getResponsiveImageUrls = (publicId: string) => {
  if (!publicId) return {};

  ensureCloudinaryConfig();

  return {
    thumbnail: cloudinary.url(publicId, {
      secure: true,
      transformation: [
        {
          width: 400,
          height: 300,
          crop: "fill",
          quality: "auto",
          fetch_format: "auto",
        },
      ],
    }),
    card: cloudinary.url(publicId, {
      secure: true,
      transformation: [
        {
          width: 400,
          height: 600,
          crop: "fill",
          quality: "auto",
          fetch_format: "auto",
        },
      ],
    }),
    tablet: cloudinary.url(publicId, {
      secure: true,
      transformation: [{ width: 1024, quality: "auto", fetch_format: "auto" }],
    }),
    full: cloudinary.url(publicId, {
      secure: true,
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    }),
  };
};
