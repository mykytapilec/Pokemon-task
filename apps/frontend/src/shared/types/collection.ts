export interface CollectionPokemon {
  id: number;
  name: string;
  weight: number;
}

export interface Collection {
  _id: string;
  name: string;
  pokemons: CollectionPokemon[];
  totalWeight: number;
}

export interface CreateCollectionPayload {
  name: string;
  pokemons: CollectionPokemon[];
}