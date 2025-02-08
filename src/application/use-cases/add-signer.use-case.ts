// src/application/use-cases/add-signer.use-case.ts
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  DOCUMENT_REPOSITORY,
  IDocumentRepository,
} from 'src/core/domain/repositories/document.repository.interface';
import {
  DocumentStatus,
  ESignDocument,
} from 'src/core/domain/entities/document.entity';
import { AddSignerDto } from '../dtos/add-signer.dto';
import {
  Signer,
  SignerRole,
  SignerStatus,
} from 'src/core/domain/entities/signer.entity';

@Injectable()
export class AddSignerUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,
  ) {}

  async execute(documentId: string, dto: AddSignerDto): Promise<ESignDocument> {
    const document = await this.documentRepository.findById(documentId);
    if (!document) {
      throw new BadRequestException('Document not found');
    }

    // Validate document status
    if (document.status !== DocumentStatus.PENDING) {
      throw new BadRequestException('Document is not in PENDING status');
    }

    // Validate signer role sequence
    const existingSigners = document.signers || [];
    if (existingSigners.length === 0 && dto.role !== SignerRole.ROLE_1) {
      throw new BadRequestException('First signer must be ROLE_1');
    }

    // Validate role sequence
    if (existingSigners.length > 0) {
      const lastSignerRole = existingSigners[existingSigners.length - 1].role;
      const currentRoleIndex = Object.values(SignerRole).indexOf(dto.role);
      const lastRoleIndex = Object.values(SignerRole).indexOf(lastSignerRole);

      if (currentRoleIndex <= lastRoleIndex) {
        throw new BadRequestException('Invalid signer role sequence');
      }
    }

    // Check for duplicate emails
    if (existingSigners.some((signer) => signer.email === dto.email)) {
      throw new BadRequestException('Signer email already exists');
    }

    const signer = new Signer();
    signer.email = dto.email;
    signer.role = dto.role;
    signer.status = SignerStatus.PENDING;
    signer.page = dto.page;
    signer.position = dto.position;

    // Add sign tag to document
    document.addSignTag(dto.role, {
      x: dto.position.x,
      y: dto.position.y,
      page: dto.page,
    });

    return this.documentRepository.addSigner(documentId, signer);
  }
}
