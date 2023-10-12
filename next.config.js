/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        APIKEY: process.env.APIKEY,
    },
    images: {
        domains: ['firebasestorage.googleapis.com', "lh3.googleusercontent.com", "graph.facebook.com"],
    },
}

module.exports = nextConfig
