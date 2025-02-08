// src/core/domain/repositories/document.repository.interface.ts
import { ESignDocument } from '../entities/document.entity';
import { Signer, SignerStatus } from '../entities/signer.entity';

export interface IDocumentRepository {
  create(document: ESignDocument): Promise<ESignDocument>;
  findAll(): Promise<ESignDocument[]>;
  findById(id: string): Promise<ESignDocument>;
  update(id: string, document: Partial<ESignDocument>): Promise<ESignDocument>;
  addSigner(id: string, signer: Signer): Promise<ESignDocument>;
  updateSignerStatus(
    id: string,
    email: string,
    status: SignerStatus,
  ): Promise<ESignDocument>;
}

export const DOCUMENT_REPOSITORY = 'DOCUMENT_REPOSITORY';
