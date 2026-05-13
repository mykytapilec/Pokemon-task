import type { Pokemon } from './pokemon';

export interface Collection {
  _id: string;
  name: string;
  pokemons: Pokemon[];
  totalWeight: number;
}

export interface CreateCollectionPayload {
  name: string;
  pokemons: Pokemon[];
}

export interface UpdateCollectionPayload {
  name?: string;
  pokemons?: Pokemon[];
}