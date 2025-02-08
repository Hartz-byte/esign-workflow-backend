// src/infrastructure/database/mongo/schemas/signer.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  SignerRole,
  SignerStatus,
} from '../../../../core/domain/entities/signer.entity';

@Schema()
export class SignerSchema {
  @Prop({ required: true })
  email: string;

  @Prop({ type: String, enum: SignerRole })
  role: SignerRole;

  @Prop({ type: String, enum: SignerStatus, default: SignerStatus.PENDING })
  status: SignerStatus;

  @Prop()
  signedAt?: Date;

  @Prop({ required: true })
  page: number;

  @Prop({ type: Object })
  position: {
    x: number;
    y: number;
  };
}

export const SignerSchemaFactory = SchemaFactory.createForClass(SignerSchema);
