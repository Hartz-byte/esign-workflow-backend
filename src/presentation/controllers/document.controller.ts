// src/presentation/controllers/document.controller.ts
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AddSignerDto } from 'src/application/dtos/add-signer.dto';
import { AddSignerUseCase } from 'src/application/use-cases/add-signer.use-case';
import { SubmitDocumentUseCase } from 'src/application/use-cases/submit-document.use-case';
import { UploadDocumentUseCase } from 'src/application/use-cases/upload-document.use-case';
import {
  DOCUMENT_REPOSITORY,
  IDocumentRepository,
} from 'src/core/domain/repositories/document.repository.interface';

@Controller('pdf')
export class DocumentController {
  constructor(
    private readonly uploadDocumentUseCase: UploadDocumentUseCase,
    private readonly addSignerUseCase: AddSignerUseCase,
    private readonly submitDocumentUseCase: SubmitDocumentUseCase,
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,
  ) {}

  @Get()
  async getAllDocuments() {
    return this.documentRepository.findAll();
  }

  @Get(':id')
  async getDocument(@Param('id') id: string) {
    const document = await this.documentRepository.findById(id);
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
          cb(new BadRequestException('Only PDF files are allowed'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  async uploadDocument(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    return this.uploadDocumentUseCase.execute({ file });
  }

  @Post(':id/signers')
  async addSigner(@Param('id') id: string, @Body() addSignerDto: AddSignerDto) {
    return this.addSignerUseCase.execute(id, addSignerDto);
  }

  @Post(':id/submit')
  async submitDocument(@Param('id') id: string) {
    return this.submitDocumentUseCase.execute(id);
  }
}
