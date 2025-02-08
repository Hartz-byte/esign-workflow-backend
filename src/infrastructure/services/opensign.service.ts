// src/infrastructure/services/opensign.service.ts
import {
  Injectable,
  Logger,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosError } from 'axios';
import { ESignDocument } from 'src/core/domain/entities/document.entity';
import { Signer } from 'src/core/domain/entities/signer.entity';
import { sleep } from 'src/utils/common';

interface OpenSignError {
  message?: string;
  status?: number;
  code?: string;
}

@Injectable()
export class OpenSignService implements OnModuleInit {
  private readonly axiosInstance: AxiosInstance;
  private readonly logger = new Logger(OpenSignService.name);
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('opensign.api_key');
    const apiUrl = this.configService.get<string>('opensign.api_url');
    const environment = this.configService.get<string>('opensign.environment');

    // Validate configuration
    if (!apiKey || !apiKey.startsWith('test.')) {
      throw new Error('Invalid OpenSign API key for sandbox environment');
    }

    if (!apiUrl || !apiUrl.includes('sandbox')) {
      throw new Error('Invalid OpenSign API URL for sandbox environment');
    }

    this.logger.log(`Initializing OpenSign service in ${environment} mode`);

    this.axiosInstance = axios.create({
      baseURL: apiUrl,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'X-OpenSign-Environment': 'sandbox',
      },
    });

    this.axiosInstance.interceptors.request.use((config) => {
      this.logger.debug(`Making request to: ${config.url}`);
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => this.handleAxiosError(error),
    );
  }

  async onModuleInit() {
    try {
      const isAvailable = await this.verifyApiConnection();
      if (!isAvailable) {
        this.logger.warn('OpenSign Sandbox API is not responding');
      } else {
        this.logger.log('Successfully connected to OpenSign Sandbox API');
      }
    } catch (error) {
      this.logger.error('Failed to initialize OpenSign service', error);
    }
  }

  private async handleAxiosError(error: AxiosError<OpenSignError>) {
    if (error.code === 'ENOTFOUND') {
      this.logger.error(
        `DNS resolution failed for OpenSign Sandbox API: ${error.message}`,
      );
      throw new BadRequestException(
        'Unable to connect to OpenSign sandbox service. Please verify your network connection and try again.',
      );
    }

    if (error.response?.status === 401) {
      this.logger.error(
        'Invalid API key or unauthorized access to OpenSign API',
      );
      throw new BadRequestException(
        'Authentication failed with OpenSign service. Please verify your API key.',
      );
    }

    // Log the full error for debugging
    this.logger.error('OpenSign API error', {
      status: error.response?.status,
      data: error.response?.data,
      code: error.code,
    });

    throw new BadRequestException(
      error.response?.data?.message ||
        'An error occurred with the signing service',
    );
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    retryCount = 0,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retryCount < this.maxRetries) {
        this.logger.warn(
          `Operation failed, retrying (${retryCount + 1}/${this.maxRetries})...`,
        );
        await sleep(this.retryDelay * Math.pow(2, retryCount));
        return this.retryOperation(operation, retryCount + 1);
      }
      throw error;
    }
  }

  async createSigningRequest(
    document: ESignDocument,
    signer: Signer,
  ): Promise<void> {
    const payload = {
      documentUrl: document.fileUrl,
      signerEmail: signer.email,
      signerName: signer.name,
      signaturePosition: {
        page: 1,
        x: 59.107,
        y: 93.587,
      },
      sandbox: true,
    };

    try {
      await this.retryOperation(async () => {
        const response = await this.axiosInstance.post('/signatures', payload);
        return response.data;
      });
    } catch (error) {
      this.logger.error('Failed to create signing request', {
        documentId: document.id,
        signerEmail: signer.email,
        error: error.message,
      });
      throw error;
    }
  }

  async verifyApiConnection(): Promise<boolean> {
    try {
      await this.axiosInstance.get('/health');
      return true;
    } catch (error) {
      this.logger.error('OpenSign API health check failed', error);
      return false;
    }
  }
}
