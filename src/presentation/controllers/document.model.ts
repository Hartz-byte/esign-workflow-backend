// src/presentation/controllers/document.model.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentController } from './document.controller';
import {
  Document,
  DocumentSchema,
} from 'src/infrastructure/database/mongo/schemas/document.schema';
import { CloudinaryService } from 'src/infrastructure/services/cloudinary.service';
import { OpenSignService } from 'src/infrastructure/services/opensign.service';
import { UploadDocumentUseCase } from 'src/application/use-cases/upload-document.use-case';
import { AddSignerUseCase } from 'src/application/use-cases/add-signer.use-case';
import { SubmitDocumentUseCase } from 'src/application/use-cases/submit-document.use-case';
import { MongoDocumentRepository } from 'src/infrastructure/database/mongo/repositories/mongo-document.repository';
import { DOCUMENT_REPOSITORY } from 'src/core/domain/repositories/document.repository.interface';

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

    // Repository
    MongoDocumentRepository,
    {
      provide: DOCUMENT_REPOSITORY,
      useClass: MongoDocumentRepository,
    },
  ],
  exports: [
    DOCUMENT_REPOSITORY,
    UploadDocumentUseCase,
    AddSignerUseCase,
    SubmitDocumentUseCase,
  ],
})
export class DocumentModule {}
