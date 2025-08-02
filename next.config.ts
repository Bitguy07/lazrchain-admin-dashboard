// next.config.js

/** @type {import('next').NextConfig} */
module.exports = {

  env: {
    SECRET_KEY: process.env.SECRET_KEY, 
    USER_SIDE_CORS_ORIGIN: process.env.USER_SIDE_CORS_ORIGIN,
  },

  devIndicators: false,

  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: process.env.USER_SIDE_CORS_ORIGIN || "http://localhost:8080" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,PATCH,DELETE,OPTIONS" },
          { key: "Access-Control-Allow-Headers", value: "Content-Type, Authorization" },
          { key: "Access-Control-Allow-Credentials", value: "true" },
        ],
      },
    ];
  },
};

