/** @type {import("next").NextConfig} */
module.exports = {
  output: "standalone",
  images: {
    unoptimized: true, // Lambda 환경에서 이미지 최적화 비활성화
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}
