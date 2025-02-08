// // src/main.ts
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import * as express from 'express';
// import { Request, Response } from 'express';
// import helmet from 'helmet';
// import compression from 'compression';
// import { OpenSignService } from './infrastructure/services/opensign.service';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const configService = app.get(ConfigService);

//   const port = configService.get<number>('port') || 3001;
//   const cloudinaryDomain = `res.cloudinary.com/${configService.get('cloudinary.cloud_name')}`;
//   const allowedOrigins = configService.get<string[]>('allowedOrigins') || [
//     'http://localhost:3000',
//     'https://cdnjs.cloudflare.com',
//   ];

//   // Global pipes
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true,
//       transform: true,
//       forbidNonWhitelisted: true,
//     }),
//   );

//   // Security headers with updated CSP
//   app.use(
//     helmet({
//       crossOriginEmbedderPolicy: false,
//       crossOriginResourcePolicy: { policy: 'cross-origin' },
//       contentSecurityPolicy: {
//         directives: {
//           defaultSrc: ["'self'"],
//           scriptSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
//           connectSrc: ["'self'", 'cdnjs.cloudflare.com', cloudinaryDomain],
//           imgSrc: ["'self'", 'data:', 'blob:', cloudinaryDomain],
//           styleSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
//           fontSrc: ["'self'", 'cdnjs.cloudflare.com'],
//           mediaSrc: [cloudinaryDomain],
//           objectSrc: ["'none'"],
//         },
//       },
//     }),
//   );

//   // Compression
//   app.use(compression());

//   // Updated CORS configuration
//   const corsOptions = {
//     origin: allowedOrigins,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
//     allowedHeaders: [
//       'Content-Type',
//       'Authorization',
//       'Accept',
//       'Origin',
//       'X-Requested-With',
//       'Range',
//     ],
//     exposedHeaders: ['Content-Length', 'Content-Range'],
//     credentials: true,
//     maxAge: 86400,
//   };

//   app.enableCors(corsOptions);

//   // Body parser with increased limit
//   app.use(express.json({ limit: '50mb' }));
//   app.use(express.urlencoded({ extended: true, limit: '50mb' }));

//   const openSignService = app.get(OpenSignService);
//   const isAvailable = await openSignService.verifyApiConnection();
//   if (!isAvailable) {
//     console.warn('OpenSign API is not available - please check configuration');
//   }

//   // Default route
//   app.use('/', (req: Request, res: Response) => {
//     res.send('Server is running!');
//   });

//   // Handle large PDF files
//   app.use(
//     '/api/upload',
//     express.raw({ type: 'application/pdf', limit: '50mb' }),
//   );

//   // Updated security headers
//   app.use((req: Request, res: Response, next) => {
//     res.header('Cross-Origin-Resource-Policy', 'cross-origin');
//     next();
//   });

//   await app.listen(port);
// }

// bootstrap();

// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import { Request, Response } from 'express';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get('port') || 3001;
  const cloudinaryDomain = `res.cloudinary.com/${configService.get('cloudinary.cloud_name')}`;
  const allowedOrigins = configService.get('allowedOrigins') || [
    'http://localhost:3000',
    'https://cdnjs.cloudflare.com',
  ];

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Security headers with updated CSP
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
          connectSrc: ["'self'", 'cdnjs.cloudflare.com', cloudinaryDomain],
          imgSrc: ["'self'", 'data:', 'blob:', cloudinaryDomain],
          styleSrc: ["'self'", "'unsafe-inline'", 'cdnjs.cloudflare.com'],
          fontSrc: ["'self'", 'cdnjs.cloudflare.com'],
          mediaSrc: [cloudinaryDomain],
          objectSrc: ["'none'"],
        },
      },
    }),
  );

  // Compression
  app.use(compression());

  // Updated CORS configuration
  const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'Range',
    ],
    exposedHeaders: ['Content-Length', 'Content-Range'],
    credentials: true,
    maxAge: 86400,
  };

  app.enableCors(corsOptions);

  // Body parser with increased limit
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Handle large PDF files
  app.use(
    '/api/upload',
    express.raw({ type: 'application/pdf', limit: '50mb' }),
  );

  // Updated security headers
  app.use((req: Request, res: Response, next) => {
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  });

  await app.listen(port);
}

bootstrap();
