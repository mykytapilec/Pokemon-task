export interface PokemonListItemDto {
  name: string;
  url: string;
}

export interface PokemonListResponseDto {
  count: number;
  results: PokemonListItemDto[];
}

export class PokemonDetailsDto {
  id!: number;

  name!: string;

  weight!: number;

  height!: number;

  sprites!: {
    front_default: string;
  };

  types!: string[];
}
