// src/application/use-cases/upload-document.use-case.ts
import { Injectable, Inject } from '@nestjs/common';
import { DOCUMENT_REPOSITORY } from 'src/core/domain/repositories/document.repository.interface';
import { IDocumentRepository } from 'src/core/domain/repositories/document.repository.interface';
import { CloudinaryService } from 'src/infrastructure/services/cloudinary.service';
import { CreateDocumentDto } from '../dtos/create-document.dto';
import {
  ESignDocument,
  DocumentStatus,
} from 'src/core/domain/entities/document.entity';

@Injectable()
export class UploadDocumentUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async execute(dto: CreateDocumentDto): Promise<ESignDocument> {
    const cloudinaryUrl = await this.cloudinaryService.uploadFile(dto.file);

    const document = new ESignDocument({
      filename: dto.file.originalname,
      cloudinaryUrl: cloudinaryUrl,
      status: DocumentStatus.PENDING,
      signers: [],
      uploadedBy: 'anonymous-user',
    });

    return this.documentRepository.create(document);
  }
}
