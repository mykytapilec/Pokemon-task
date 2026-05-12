import type { Pokemon } from "./pokemon";

export interface CollectionPokemon {
  id: number;
  name: string;
  weight: number;
}

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