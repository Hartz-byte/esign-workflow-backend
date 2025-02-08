// src/core/domain/entities/signer.entity.ts
export enum SignerRole {
  ROLE_1 = 'ROLE_1',
  ROLE_2 = 'ROLE_2',
  ROLE_3 = 'ROLE_3',
}

export enum SignerStatus {
  PENDING = 'PENDING',
  SIGNED = 'SIGNED',
  REJECTED = 'REJECTED',
}

export class Signer {
  email: string;
  role: SignerRole;
  name: string;
  status: SignerStatus;
  signedAt?: Date;
  page: number;
  position: {
    x: number;
    y: number;
  };
}
