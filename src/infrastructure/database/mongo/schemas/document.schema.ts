// src/infrastructure/database/mongo/schemas/document.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongoDocument } from 'mongoose';
import { SignerSchema } from './signer.schema';
import { DocumentStatus } from '../../../../core/domain/entities/document.entity';
import { Signer } from 'src/core/domain/entities/signer.entity';

export type DocumentDocument = Document & MongoDocument;

@Schema({ timestamps: true })
export class Document {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  cloudinaryUrl: string;

  @Prop({ type: String, enum: DocumentStatus, default: DocumentStatus.PENDING })
  status: DocumentStatus;

  @Prop({ type: [SignerSchema] })
  signers: Signer[];

  @Prop()
  signTags?: {
    role: string;
    position: {
      x: number;
      y: number;
      page: number;
    };
  }[];

  @Prop()
  opensignDocumentId?: string;

  @Prop({ required: true })
  uploadedBy: string;
}

export const DocumentSchema = SchemaFactory.createForClass(Document);
