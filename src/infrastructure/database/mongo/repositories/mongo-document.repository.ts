// src/infrastructure/database/mongo/repositories/mongo-document.repository.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ESignDocument } from '../../../../core/domain/entities/document.entity';
import { IDocumentRepository } from '../../../../core/domain/repositories/document.repository.interface';
import { Document, DocumentDocument } from '../schemas/document.schema';
import {
  Signer,
  SignerStatus,
} from '../../../../core/domain/entities/signer.entity';

@Injectable()
export class MongoDocumentRepository implements IDocumentRepository {
  constructor(
    @InjectModel(Document.name)
    private documentModel: Model<DocumentDocument>,
  ) {}

  async create(document: ESignDocument): Promise<ESignDocument> {
    const createdDocument = new this.documentModel(document);
    const saved = await createdDocument.save();
    return this.toEntity(saved);
  }

  async findAll(): Promise<ESignDocument[]> {
    const documents = await this.documentModel.find().exec();
    return documents.map(this.toEntity);
  }

  async findById(id: string): Promise<ESignDocument> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return this.toEntity(document);
  }

  async update(
    id: string,
    document: Partial<ESignDocument>,
  ): Promise<ESignDocument> {
    const updated = await this.documentModel
      .findByIdAndUpdate(id, document, { new: true })
      .exec();
    if (!updated) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }
    return this.toEntity(updated);
  }

  async addSigner(id: string, signer: Signer): Promise<ESignDocument> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    document.signers = [...(document.signers || []), signer];
    const updated = await document.save();
    return this.toEntity(updated);
  }

  async updateSignerStatus(
    id: string,
    email: string,
    status: SignerStatus,
  ): Promise<ESignDocument> {
    const document = await this.documentModel.findById(id).exec();
    if (!document) {
      throw new NotFoundException(`Document with ID ${id} not found`);
    }

    const signerIndex = document.signers.findIndex((s) => s.email === email);
    if (signerIndex === -1) {
      throw new NotFoundException(`Signer with email ${email} not found`);
    }

    document.signers[signerIndex].status = status;
    const updated = await document.save();
    return this.toEntity(updated);
  }

  private toEntity(document: any): ESignDocument {
    return new ESignDocument({
      id: document._id.toString(),
      filename: document.filename,
      cloudinaryUrl: document.cloudinaryUrl,
      status: document.status,
      signers: document.signers,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    });
  }
}
