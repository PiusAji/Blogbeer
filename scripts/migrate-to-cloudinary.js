// scripts/migrate-to-cloudinary.ts
import { config as dotenvConfig } from "dotenv";
import payload from "payload";
import path from "path";
import fs from "fs";
import { uploadToCloudinary } from "../src/app/(my-app)/utils/cloudinary";
import config from "../payload.config";

// Load environment variables
dotenvConfig({ path: path.resolve(process.cwd(), ".env.local") });

const migrateMediaToCloudinary = async () => {
  // Debug: Check if env variables are loaded
  console.log(
    "CLOUDINARY_CLOUD_NAME:",
    process.env.CLOUDINARY_CLOUD_NAME ? "Found" : "Missing"
  );
  console.log(
    "CLOUDINARY_API_KEY:",
    process.env.CLOUDINARY_API_KEY ? "Found" : "Missing"
  );
  console.log(
    "CLOUDINARY_API_SECRET:",
    process.env.CLOUDINARY_API_SECRET ? "Found" : "Missing"
  );

  await payload.init({
    config,
  });

  try {
    // Get all media documents that don't have Cloudinary URLs
    const { docs } = await payload.find({
      collection: "media",
      where: {
        cloudinaryUrl: {
          exists: false,
        },
      },
    });

    console.log(`Found ${docs.length} media files to migrate`);

    for (const doc of docs) {
      try {
        // Check if filename exists and is valid
        if (!doc.filename) {
          console.log(`No filename for document ${doc.id}, skipping...`);
          continue;
        }

        console.log(`Migrating ${doc.filename}...`);

        const filePath = path.join(process.cwd(), "media", doc.filename);

        if (!fs.existsSync(filePath)) {
          console.log(`File not found: ${filePath}, skipping...`);
          continue;
        }

        const fileBuffer = fs.readFileSync(filePath);

        // Upload to Cloudinary
        const { url, public_id } = await uploadToCloudinary(
          fileBuffer,
          doc.filename,
          "payload-media"
        );

        // Update the document
        await payload.update({
          collection: "media",
          id: doc.id,
          data: {
            cloudinaryUrl: url,
            cloudinaryPublicId: public_id,
          },
        });

        console.log(`✅ Migrated ${doc.filename} to ${url}`);

        // Add delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`❌ Error migrating ${doc.filename}:`, error);
      }
    }

    console.log("Migration completed!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
};

// Run the migration
migrateMediaToCloudinary();
