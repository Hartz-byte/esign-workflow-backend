// src/config/configuration.ts
export default () => ({
  port: process.env.PORT ? parseInt(process.env.PORT) : 3001,
  database: {
    uri: process.env.MONGODB_URI || '',
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
    api_key: process.env.CLOUDINARY_API_KEY || '',
    api_secret: process.env.CLOUDINARY_API_SECRET || '',
    secure: true,
  },
  opensign: {
    api_key: process.env.OPENSIGN_API_KEY || '',
    api_url: process.env.OPENSIGN_API_URL || 'https://api.opensignlabs.com/v1',
  },
  frontend: {
    url: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  allowedOrigins: [
    process.env.CORS_ORIGIN || 'http://localhost:3000',
    'https://cdnjs.cloudflare.com',
    `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME || ''}`,
  ],
});
