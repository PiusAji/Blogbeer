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

        console.log(`\n🔄 Starting migration for ${doc.filename}...`);
        console.log(`Document ID: ${doc.id}`);

        const filePath = path.join(process.cwd(), "media", doc.filename);

        if (!fs.existsSync(filePath)) {
          console.log(`File not found: ${filePath}, skipping...`);
          continue;
        }

        const fileBuffer = fs.readFileSync(filePath);
        console.log(
          `✅ File read successfully, size: ${fileBuffer.length} bytes`
        );

        // Upload to Cloudinary
        console.log(`📤 Uploading to Cloudinary...`);
        const { url, public_id } = await uploadToCloudinary(
          fileBuffer,
          doc.filename,
          "payload-media"
        );
        console.log(`✅ Cloudinary upload success: ${url}`);
        console.log(`Public ID: ${public_id}`);

        // Update the document
        console.log(`💾 Updating database record...`);
        const updateResult = await payload.update({
          collection: "media",
          id: doc.id,
          data: {
            cloudinaryUrl: url,
            cloudinaryPublicId: public_id,
          },
        });

        console.log(`✅ Database update result:`, {
          id: updateResult.id,
          filename: updateResult.filename,
          cloudinaryUrl: updateResult.cloudinaryUrl,
          cloudinaryPublicId: updateResult.cloudinaryPublicId,
        });

        // Verify the update by fetching the record
        const verifyRecord = await payload.findByID({
          collection: "media",
          id: doc.id,
        });

        console.log(`🔍 Verification - Record after update:`, {
          id: verifyRecord.id,
          filename: verifyRecord.filename,
          hasCloudinaryUrl: !!verifyRecord.cloudinaryUrl,
          hasCloudinaryPublicId: !!verifyRecord.cloudinaryPublicId,
        });

        console.log(`✅ Migration completed for ${doc.filename}`);

        // Add delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`❌ Error migrating ${doc.filename}:`, error);
        // Continue with next file instead of stopping
      }
    }

    console.log("\n🎉 Migration completed!");

    // Final verification - count how many records now have Cloudinary URLs
    const { totalDocs: totalWithCloudinary } = await payload.count({
      collection: "media",
      where: {
        cloudinaryUrl: {
          exists: true,
        },
      },
    });

    const { totalDocs: totalMedia } = await payload.count({
      collection: "media",
    });

    console.log(
      `📊 Final stats: ${totalWithCloudinary}/${totalMedia} records have Cloudinary URLs`
    );
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
};

// Run the migration
migrateMediaToCloudinary();
