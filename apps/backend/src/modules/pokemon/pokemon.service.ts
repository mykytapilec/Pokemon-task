import { Injectable } from '@nestjs/common';

import { PokemonClient } from './client/pokemon.client';

import { PokemonDetailsDto, PokemonListResponseDto } from './dto/pokemon.dto';

@Injectable()
export class PokemonService {
  private readonly client = new PokemonClient();

  async getPokemonList(
    limit: number,
    offset: number,
  ): Promise<PokemonListResponseDto> {
    const data = await this.client.getPokemonList(limit, offset);

    return {
      count: data.count,
      results: data.results.map((item) => ({
        name: item.name,
        url: item.url,
      })),
    };
  }

  async getPokemon(name: string): Promise<PokemonDetailsDto> {
    const data = await this.client.getPokemonByName(name);

    return {
      id: data.id,
      name: data.name,
      weight: data.weight,
      height: data.height,

      sprites: {
        front_default:
          typeof data.sprites.front_default === 'string'
            ? data.sprites.front_default
            : '',
      },

      types: data.types.map((type) => type.type.name),
    };
  }
}
