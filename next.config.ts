import type { NextConfig } from "next";

if (!process.env.DATABASE_URL) {
  require("dotenv").config();
  // Set a placeholder DATABASE_URL during build if not available
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = "postgresql://user:password@localhost:5432/vcard?schema=public";
  }
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
