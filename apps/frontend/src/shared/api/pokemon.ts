import { api } from './client';

import type {
  PokemonDetails,
  PokemonListResponse,
} from '../types/pokemon';

export const pokemonApi = {
  getAll: async (
    limit = 20,
    offset = 0,
  ): Promise<PokemonListResponse> => {
    const response =
      await api.get<PokemonListResponse>(
        `/pokemon?limit=${limit}&offset=${offset}`,
      );

    return response.data;
  },

  getByName: async (
    name: string,
  ): Promise<PokemonDetails> => {
    const response =
      await api.get<PokemonDetails>(
        `/pokemon/${name}`,
      );

    return response.data;
  },
};