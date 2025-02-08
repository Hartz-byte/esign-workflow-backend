// src/core/domain/entities/document.entity.ts
import { Signer, SignerRole } from './signer.entity';

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  PENDING_SIGNATURES = 'PENDING_SIGNATURES',
  SIGNING = 'SIGNING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
}

export class ESignDocument {
  id: string;
  title: string;
  filename: string;
  cloudinaryUrl: string;
  fileName: string;
  fileUrl: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  status: DocumentStatus;
  signers: Signer[];
  currentSignerRole?: SignerRole;
  uploadedBy: string = 'anonymous-user';
  signTags?: {
    role: SignerRole;
    position: {
      x: number;
      y: number;
      page: number;
    };
  }[];
  opensignDocumentId?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial?: Partial<ESignDocument>) {
    if (partial) {
      Object.assign(this, partial);
    }
    this.signers = partial?.signers || [];
    this.status = partial?.status || DocumentStatus.DRAFT;
    this.signTags = partial?.signTags || [];
    this.createdAt = partial?.createdAt || new Date();
    this.updatedAt = partial?.updatedAt || new Date();
    this.uploadedBy = partial?.uploadedBy || 'anonymous-user';
  }

  canSign(signerEmail: string): boolean {
    const signer = this.signers.find((s) => s.email === signerEmail);
    return signer?.role === this.currentSignerRole;
  }

  addSignTag(
    role: SignerRole,
    position: { x: number; y: number; page: number },
  ) {
    if (!this.signTags) {
      this.signTags = [];
    }
    this.signTags.push({ role, position });
  }

  updateStatus(newStatus: DocumentStatus) {
    this.status = newStatus;
    this.updatedAt = new Date();
  }
}
