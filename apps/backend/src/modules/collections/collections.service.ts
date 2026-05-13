import { Injectable } from '@nestjs/common';
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
    private model: Model<CollectionDocument>,
  ) {}

  async create(dto: CreateCollectionDto) {
    const { pokemons, totalWeight } = CollectionValidator.validate({
      pokemons: dto.pokemons,
    });

    return this.model.create({
      ...dto,
      pokemons,
      totalWeight,
    });
  }

  async findAll() {
    return this.model.find();
  }

  async findOne(id: string) {
    return this.model.findById(id);
  }

  async update(id: string, dto: UpdateCollectionDto) {
    const existing = await this.model.findById(id);

    if (!existing) return null;

    const pokemons = dto.pokemons ?? existing.pokemons;

    const validated = CollectionValidator.validate({ pokemons });

    return this.model.findByIdAndUpdate(
      id,
      {
        name: dto.name ?? existing.name,
        pokemons: validated.pokemons,
        totalWeight: validated.totalWeight,
      },
      { new: true },
    );
  }

  async delete(id: string) {
    return this.model.findByIdAndDelete(id);
  }
}
