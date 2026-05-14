import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Collection, CollectionDocument } from './schemas/collection.schema';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionValidator } from './domain/collection.validator';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection.name)
    private readonly model: Model<CollectionDocument>,
  ) {}

  async create(dto: CreateCollectionDto) {
    const validated = CollectionValidator.validate({
      pokemons: dto.pokemons,
    });

    return this.model.create({
      name: dto.name,
      pokemons: validated.pokemons,
      totalWeight: validated.totalWeight,
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
    const deleted = await this.model.findByIdAndDelete(id).exec();

    if (!deleted) {
      throw new NotFoundException('Collection not found');
    }

    return deleted;
  }

  async update(id: string, dto: UpdateCollectionDto) {
    const collection = await this.model.findById(id).exec();

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    const pokemons = dto.pokemons ?? collection.pokemons;
    const name = dto.name ?? collection.name;

    const totalWeight = pokemons.reduce((sum, p) => sum + p.weight, 0);

    return this.model.findByIdAndUpdate(
      id,
      {
        name,
        pokemons,
        totalWeight,
      },
      { new: true },
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import(file: any) {
    return { ok: true };
  }

  async export(id: string) {
    const collection = await this.model.findById(id).exec();

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    return collection;
  }
}
