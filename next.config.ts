import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com"], // Add this line
    // ... your other config
  },
};

export default withPayload(nextConfig);
