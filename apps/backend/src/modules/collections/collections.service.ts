import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Collection, CollectionDocument } from './schemas/collection.schema';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CollectionValidator } from './domain/collection.validator';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection.name)
    private model: Model<CollectionDocument>,
  ) {}

  async create(dto: CreateCollectionDto) {
    const { totalWeight } = CollectionValidator.validate(dto.pokemons);

    return this.model.create({
      ...dto,
      totalWeight,
    });
  }

  async findAll() {
    return this.model.find().exec();
  }

  async findOne(id: string) {
    const collection = await this.model.findById(id).exec();

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    return collection;
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id).exec();
  }
}
