// // src/application/use-cases/submit-document.use-case.ts
// import { BadRequestException, Inject, Injectable } from '@nestjs/common';
// import {
//   ESignDocument,
//   DocumentStatus,
// } from 'src/core/domain/entities/document.entity';
// import { SignerRole } from 'src/core/domain/entities/signer.entity';
// import {
//   IDocumentRepository,
//   DOCUMENT_REPOSITORY,
// } from 'src/core/domain/repositories/document.repository.interface';
// import { OpenSignService } from 'src/infrastructure/services/opensign.service';

// @Injectable()
// export class SubmitDocumentUseCase {
//   constructor(
//     @Inject(DOCUMENT_REPOSITORY)
//     private readonly documentRepository: IDocumentRepository,
//     private readonly openSignService: OpenSignService,
//   ) {}

//   async execute(documentId: string): Promise<ESignDocument> {
//     const document = await this.documentRepository.findById(documentId);
//     if (!document) {
//       throw new BadRequestException('Document not found');
//     }

//     if (!document.signers.length) {
//       throw new BadRequestException('No signers added to the document');
//     }

//     // Validate required roles
//     const roles = document.signers.map((s) => s.role);
//     if (!roles.includes(SignerRole.ROLE_1)) {
//       throw new BadRequestException('Document must have a ROLE_1 signer');
//     }

//     // Sort signers by role to ensure proper signing order
//     const sortedSigners = document.signers.sort(
//       (a, b) =>
//         Object.values(SignerRole).indexOf(a.role) -
//         Object.values(SignerRole).indexOf(b.role),
//     );

//     // Create signing request for first signer only (ROLE_1)
//     const firstSigner = sortedSigners[0];
//     await this.openSignService.createSigningRequest(document, firstSigner);

//     // Update document status and current signer
//     const updatedDocument = await this.documentRepository.update(documentId, {
//       status: DocumentStatus.SIGNING,
//       currentSignerRole: firstSigner.role,
//     });

//     return updatedDocument;
//   }
// }

// src/application/use-cases/submit-document.use-case.ts
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  DocumentStatus,
  ESignDocument,
} from 'src/core/domain/entities/document.entity';
import { SignerRole } from 'src/core/domain/entities/signer.entity';
import {
  IDocumentRepository,
  DOCUMENT_REPOSITORY,
} from 'src/core/domain/repositories/document.repository.interface';
import { OpenSignService } from 'src/infrastructure/services/opensign.service';

@Injectable()
export class SubmitDocumentUseCase {
  constructor(
    @Inject(DOCUMENT_REPOSITORY)
    private readonly documentRepository: IDocumentRepository,
    private readonly openSignService: OpenSignService,
  ) {}

  async execute(documentId: string): Promise<ESignDocument> {
    const document = await this.documentRepository.findById(documentId);
    if (!document) {
      throw new BadRequestException('Document not found');
    }

    if (!document.signers.length) {
      throw new BadRequestException('No signers added to the document');
    }

    // Validate required roles
    const roles = document.signers.map((s) => s.role);
    if (!roles.includes(SignerRole.ROLE_1)) {
      throw new BadRequestException('Document must have a ROLE_1 signer');
    }

    // Sort signers by role to ensure proper signing order
    const sortedSigners = document.signers.sort(
      (a, b) =>
        Object.values(SignerRole).indexOf(a.role) -
        Object.values(SignerRole).indexOf(b.role),
    );

    // Create signing request for first signer only (ROLE_1)
    const firstSigner = sortedSigners[0];
    await this.openSignService.createSigningRequest(document, firstSigner);

    // Update document status and current signer
    const updatedDocument = await this.documentRepository.update(documentId, {
      status: DocumentStatus.SIGNING,
      currentSignerRole: firstSigner.role,
    });

    return updatedDocument;
  }
}
