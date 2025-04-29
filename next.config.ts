import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};

export default nextConfig;
