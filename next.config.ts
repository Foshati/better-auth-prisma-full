import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	webpack: (config) => {
		config.externals.push("@libsql/client");
		return config;
	},
	output: 'standalone',

};

export default nextConfig;
