/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	swcMinify: true,
	images: {
		domains: ["m.media-amazon.com", "images.pexels.com", "127.0.0.1"],
		unoptimized: true,
	},
};

module.exports = nextConfig;
// next.config.js
/*const withOptimizedImages = require('next-optimized-images')
module.exports = withOptimizedImages({})
*/
