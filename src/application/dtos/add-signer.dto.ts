// src/application/dtos/add-signer.dto.ts
import {
  IsEmail,
  IsEnum,
  IsNumber,
  Min,
  Max,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SignerRole } from '../../core/domain/entities/signer.entity';

export class Position {
  @IsNumber()
  @Min(0)
  @Max(100)
  x: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  y: number;
}

export class AddSignerDto {
  @IsEmail()
  email: string;

  @IsEnum(SignerRole)
  role: SignerRole;

  @IsNumber()
  @Min(1)
  page: number;

  @IsObject()
  @ValidateNested()
  @Type(() => Position)
  position: Position;
}
