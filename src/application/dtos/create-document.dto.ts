// src/application/dtos/create-document.dto.ts
import { IsNotEmpty } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  file: Express.Multer.File;
}
