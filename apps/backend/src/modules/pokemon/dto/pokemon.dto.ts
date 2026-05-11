export interface PokemonListItemDto {
  name: string;
  url: string;
}

export interface PokemonListResponseDto {
  count: number;
  results: PokemonListItemDto[];
}

export interface PokemonDetailsDto {
  id: number;
  name: string;
  weight: number;
  height: number;
  sprites: Record<string, any>;
  types: string[];
}
