import { buildConfig } from "payload";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import sharp from "sharp";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "@/app/(my-app)/utils/cloudinary";
import fs from "fs";
import path from "path";

export default buildConfig({
  admin: {
    user: "users",
  },
  collections: [
    {
      slug: "media",
      access: {
        read: () => true,
      },
      upload: {
        // Keep staticDir for local development
        staticDir: "media",
        // Disable image processing since Cloudinary will handle it
        disableLocalStorage: process.env.NODE_ENV === "production",
        imageSizes: [
          {
            name: "thumbnail",
            width: 400,
            height: 300,
            position: "centre",
          },
          {
            name: "card",
            width: 400,
            height: 600,
            position: "centre",
          },
          {
            name: "tablet",
            width: 1024,
            height: undefined,
            position: "centre",
          },
        ],
        resizeOptions: {
          width: 1920,
          height: 1080,
          fit: "inside",
          withoutEnlargement: true,
        },
        adminThumbnail: "thumbnail",
        mimeTypes: ["image/*", "video/*"],
      },
      fields: [
        {
          name: "alt",
          type: "text",
        },
        {
          name: "cloudinaryUrl",
          type: "text",
          admin: {
            readOnly: true,
            description: "Cloudinary CDN URL",
          },
        },
        {
          name: "cloudinaryPublicId",
          type: "text",
          admin: {
            readOnly: true,
            hidden: true,
          },
        },
      ],
      hooks: {
        afterChange: [
          async ({ doc, operation, req }) => {
            // Upload to Cloudinary on create
            if (operation === "create" && doc.filename) {
              try {
                let fileBuffer: Buffer;

                // In development, read from local file
                if (process.env.NODE_ENV === "development") {
                  const filePath = path.join(
                    process.cwd(),
                    "media",
                    doc.filename
                  );
                  if (fs.existsSync(filePath)) {
                    fileBuffer = fs.readFileSync(filePath);
                  } else {
                    console.error(`File not found: ${filePath}`);
                    return;
                  }
                } else {
                  // In production, the file should be in req.file or similar
                  // This depends on how Payload handles uploads in serverless
                  if (req.file && req.file.data) {
                    fileBuffer = req.file.data;
                  } else {
                    console.error("No file data available for upload");
                    return;
                  }
                }

                // Upload to Cloudinary
                const { url, public_id } = await uploadToCloudinary(
                  fileBuffer,
                  doc.filename,
                  "payload-media"
                );

                // Update the document in the database
                await req.payload.update({
                  collection: "media",
                  id: doc.id,
                  data: {
                    cloudinaryUrl: url,
                    cloudinaryPublicId: public_id,
                  },
                });

                console.log(`Uploaded ${doc.filename} to Cloudinary: ${url}`);
              } catch (error) {
                console.error("Error uploading to Cloudinary:", error);
              }
            }
          },
        ],
        afterDelete: [
          async ({ doc }) => {
            // Delete from Cloudinary when document is deleted
            if (doc.cloudinaryPublicId) {
              try {
                await deleteFromCloudinary(doc.cloudinaryPublicId);
                console.log(
                  `Deleted ${doc.cloudinaryPublicId} from Cloudinary`
                );
              } catch (error) {
                console.error("Error deleting from Cloudinary:", error);
              }
            }
          },
        ],
      },
    },

    // Categories Collection - for blog post categories
    {
      slug: "categories",
      access: {
        read: () => true,
      },
      admin: {
        useAsTitle: "name",
      },
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
        },
        {
          name: "featuredImage",
          type: "upload",
          relationTo: "media",
          admin: {
            description:
              "Category image used in homepage carousel and as banner on category pages",
          },
        },
        {
          name: "description",
          type: "textarea",
          admin: {
            description: "Brief description of this category",
          },
        },
      ],
    },

    // Posts Collection - for blog posts
    {
      slug: "posts",
      access: {
        read: () => true,
      },
      admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "categories", "publishedAt", "views"],
      },
      fields: [
        {
          name: "title",
          type: "text",
          required: true,
        },
        {
          name: "slug",
          type: "text",
          required: true,
          unique: true,
        },
        {
          name: "content",
          type: "richText",
          required: true,
        },
        {
          name: "excerpt",
          type: "textarea",
          admin: {
            description: "Brief summary of the post (for cards and meta)",
          },
        },
        {
          name: "featuredImage",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "categories",
          type: "relationship",
          relationTo: "categories",
          hasMany: true,
          required: true,
        },
        {
          name: "publishedAt",
          type: "date",
          defaultValue: () => new Date(),
          admin: {
            position: "sidebar",
          },
        },
        {
          name: "views",
          type: "number",
          defaultValue: 0,
          admin: {
            readOnly: true,
            position: "sidebar",
            description: "Auto-incremented when post is viewed",
          },
        },
        {
          name: "featured",
          type: "checkbox",
          defaultValue: false,
          admin: {
            position: "sidebar",
            description: "Mark as featured post",
          },
        },
        {
          name: "author",
          type: "relationship",
          relationTo: "users",
          admin: {
            position: "sidebar",
          },
        },
        {
          name: "tags",
          type: "array",
          admin: {
            description: "Additional tags for SEO and filtering",
          },
          fields: [
            {
              name: "tag",
              type: "text",
            },
          ],
        },
        {
          name: "seo",
          type: "group",
          fields: [
            {
              name: "title",
              type: "text",
              admin: {
                description: "Override the default SEO title",
              },
            },
            {
              name: "description",
              type: "textarea",
              admin: {
                description: "Meta description for search engines",
              },
            },
            {
              name: "keywords",
              type: "text",
              admin: {
                description: "Comma-separated keywords",
              },
            },
          ],
        },
      ],
      indexes: [
        {
          fields: ["publishedAt"],
        },
      ],
    },

    // Users Collection - for admin users
    {
      slug: "users",
      auth: true,
      admin: {
        useAsTitle: "email",
      },
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
        },
        {
          name: "bio",
          type: "textarea",
        },
        {
          name: "avatar",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "role",
          type: "select",
          options: [
            {
              label: "Admin",
              value: "admin",
            },
            {
              label: "Editor",
              value: "editor",
            },
            {
              label: "Author",
              value: "author",
            },
          ],
          defaultValue: "author",
        },
      ],
    },
  ],

  globals: [
    // Homepage Global - for unique homepage content
    {
      slug: "homepage",
      access: {
        read: () => true,
      },
      admin: {
        group: "Site Content",
      },
      fields: [
        {
          name: "title",
          type: "text",
          defaultValue: "Homepage",
          admin: {
            hidden: true, // Hide since it's always "Homepage"
          },
        },

        // Hero Section
        {
          name: "hero",
          type: "group",
          label: "Hero Section",
          fields: [
            {
              name: "video",
              type: "upload",
              relationTo: "media",
              required: true,
              admin: {
                description: "Background video for hero section",
              },
            },
            {
              name: "title",
              type: "text",
              required: true,
              admin: {
                description: "Main hero title (H1)",
              },
            },
            {
              name: "description",
              type: "textarea",
              admin: {
                description: "Hero description text",
              },
            },
            {
              name: "ctaButton",
              type: "group",
              label: "Call to Action Button",
              fields: [
                {
                  name: "text",
                  type: "text",
                  defaultValue: "Learn More",
                },
                {
                  name: "url",
                  type: "text",
                  defaultValue: "#about",
                },
              ],
            },
          ],
        },

        // About Section
        {
          name: "about",
          type: "group",
          label: "About Section",
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
              admin: {
                description: "About section title (H2)",
              },
            },
            {
              name: "floatingBoxes",
              type: "array",
              label: "Floating Text Boxes",
              minRows: 4,
              maxRows: 4,
              admin: {
                description: "Exactly 4 floating text boxes",
              },
              fields: [
                {
                  name: "title",
                  type: "text",
                  required: true,
                  admin: {
                    description: "Box title (H3)",
                  },
                },
                {
                  name: "description",
                  type: "textarea",
                  admin: {
                    description: "Box description text",
                  },
                },
                {
                  name: "icon",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description: "Optional icon for the box",
                  },
                },
              ],
            },
          ],
        },

        // Blog Section Settings
        {
          name: "blogSection",
          type: "group",
          label: "Blog Section",
          fields: [
            {
              name: "title",
              type: "text",
              defaultValue: "Latest Posts",
              admin: {
                description: "Blog section title",
              },
            },
            {
              name: "showCategories",
              type: "checkbox",
              defaultValue: true,
              admin: {
                description: "Show categories carousel",
              },
            },
            {
              name: "postsPerPage",
              type: "number",
              defaultValue: 5,
              admin: {
                description: "Number of posts to show initially",
              },
            },
            {
              name: "subtitle",
              type: "textarea",
              admin: {
                description: "Optional subtitle for blog section",
              },
            },
          ],
        },
      ],
    },

    // Site Settings Global - for general site configuration
    {
      slug: "siteSettings",
      admin: {
        group: "Site Settings",
      },
      fields: [
        {
          name: "siteName",
          type: "text",
          required: true,
          defaultValue: "My Blog",
        },
        {
          name: "siteDescription",
          type: "textarea",
          admin: {
            description: "Default meta description for the site",
          },
        },
        {
          name: "logo",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "Site logo (if you want it to be dynamic later)",
          },
        },
        {
          name: "favicon",
          type: "upload",
          relationTo: "media",
        },
        {
          name: "socialMedia",
          type: "group",
          fields: [
            {
              name: "twitter",
              type: "text",
            },
            {
              name: "instagram",
              type: "text",
            },
            {
              name: "linkedin",
              type: "text",
            },
            {
              name: "github",
              type: "text",
            },
          ],
        },
        {
          name: "googleAnalytics",
          type: "text",
          admin: {
            description: "Google Analytics tracking ID",
          },
        },
      ],
    },
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || "Kiddy999",
  typescript: {
    outputFile: "payload-types.ts",
  },
  db: mongooseAdapter({
    url:
      process.env.DATABASE_URI ||
      "mongodb+srv://dbBlogbeer:Kiddy999%40@cluster0.azmymho.mongodb.net/test?retryWrites=true&w=majority&appName=Cluster0",
    connectOptions: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxIdleTimeMS: 30000,
      waitQueueTimeoutMS: 5000,
    },
  }),
  debug: true,
  sharp,
});
