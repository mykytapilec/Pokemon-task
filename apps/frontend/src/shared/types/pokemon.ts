export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  results: PokemonListItem[];
}

export interface PokemonDetails {
  id: number;
  name: string;
  weight: number;
  height: number;
  sprites: {
    front_default: string;
  };
  types: string[];
}