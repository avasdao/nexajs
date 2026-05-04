// next.config.js

const withMarkdoc = require('@markdoc/next.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    pageExtensions: ['js', 'jsx', 'md'],
    experimental: {
        scrollRestoration: true,
    },
    images: {
        unoptimized: true,
    },
    // assetPrefix: './',
}

module.exports = withMarkdoc()(nextConfig)
