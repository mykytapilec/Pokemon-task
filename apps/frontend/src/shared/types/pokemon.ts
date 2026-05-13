export interface Pokemon {
  _id: string;

  id: number;
  name: string;

  weight: number;
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

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  results: PokemonListItem[];
}