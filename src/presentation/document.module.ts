// src/presentation/document.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentController } from './controllers/document.controller';
import {
  Document,
  DocumentSchema,
} from '../infrastructure/database/mongo/schemas/document.schema';
import { CloudinaryService } from '../infrastructure/services/cloudinary.service';
import { OpenSignService } from '../infrastructure/services/opensign.service';
import { UploadDocumentUseCase } from '../application/use-cases/upload-document.use-case';
import { AddSignerUseCase } from '../application/use-cases/add-signer.use-case';
import { SubmitDocumentUseCase } from '../application/use-cases/submit-document.use-case';
import { MongoDocumentRepository } from '../infrastructure/database/mongo/repositories/mongo-document.repository';
import { DOCUMENT_REPOSITORY } from '../core/domain/repositories/document.repository.interface';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Document.name, schema: DocumentSchema },
    ]),
  ],
  controllers: [DocumentController],
  providers: [
    // Services
    CloudinaryService,
    OpenSignService,

    // Use Cases
    UploadDocumentUseCase,
    AddSignerUseCase,
    SubmitDocumentUseCase,

    // Repositories
    {
      provide: DOCUMENT_REPOSITORY,
      useClass: MongoDocumentRepository,
    },
  ],
  exports: [DOCUMENT_REPOSITORY],
})
export class DocumentModule {}
