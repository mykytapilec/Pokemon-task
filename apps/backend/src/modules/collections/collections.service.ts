import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Collection, CollectionDocument } from './schemas/collection.schema';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { CollectionValidator } from './domain/collection.validator';
import { PokemonDto } from './dto/pokemon.dto';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectModel(Collection.name)
    private model: Model<CollectionDocument>,
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
    return this.model.find().lean();
  }

  async findOne(id: string) {
    const collection = await this.model.findById(id).lean();

    if (!collection) throw new NotFoundException();

    return collection;
  }

  async delete(id: string) {
    const res = await this.model.findByIdAndDelete(id);
    if (!res) throw new NotFoundException();
    return res;
  }

  async rename(id: string, name: string) {
    const res = await this.model.findByIdAndUpdate(id, { name }, { new: true });

    if (!res) throw new NotFoundException();

    return res;
  }

  async addPokemon(id: string, pokemon: PokemonDto) {
    const collection = await this.model.findById(id);
    if (!collection) throw new NotFoundException();

    const updated = [
      ...(collection.pokemons as PokemonDto[]),
      {
        id: pokemon.id,
        name: pokemon.name,
        weight: pokemon.weight,
      },
    ];

    const validated = CollectionValidator.validate({
      pokemons: updated,
    });

    return this.model.findByIdAndUpdate(
      id,
      {
        pokemons: validated.pokemons,
        totalWeight: validated.totalWeight,
      },
      { new: true },
    );
  }

  async removePokemon(id: string, pokemonId: number) {
    const collection = await this.model.findById(id);
    if (!collection) throw new NotFoundException();

    const updated = (collection.pokemons as PokemonDto[]).filter(
      (p) => p.id !== pokemonId,
    );

    const validated = CollectionValidator.validate({
      pokemons: updated,
    });

    return this.model.findByIdAndUpdate(
      id,
      {
        pokemons: validated.pokemons,
        totalWeight: validated.totalWeight,
      },
      { new: true },
    );
  }

  // CLEAN EXPORT (fix TS error)
  async export(id: string) {
    const collection = await this.findOne(id);

    return {
      ...collection,
      exportedAt: new Date().toISOString(),
    };
  }
}
