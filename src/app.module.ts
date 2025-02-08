// src/app.module.ts
import { Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentModule } from './presentation/document.module';
import configuration from './config/configuration';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),

    // Database Connection
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('database.uri');

        Logger.log('Connecting to MongoDB!', 'MongooseModule');

        return {
          uri,
          connectionFactory: (connection) => {
            connection.on('connected', () => {
              Logger.log('MongoDB Connected!', 'MongooseModule');
            });

            connection.on('error', (error) => {
              Logger.error(
                `MongoDB Connection Error: ${error.message}`,
                'MongooseModule',
              );
            });

            connection.on('disconnected', () => {
              Logger.warn('MongoDB Disconnected!', 'MongooseModule');
            });

            return connection;
          },
        };
      },
    }),

    // Feature modules
    DocumentModule,
  ],
})
export class AppModule {}
