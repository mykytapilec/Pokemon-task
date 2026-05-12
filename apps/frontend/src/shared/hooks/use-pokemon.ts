import { useQuery } from '@tanstack/react-query';
import { pokemonApi } from '../api/pokemon';

import type { Pokemon } from '../types/pokemon';

interface PokemonApiListItem {
  name: string;
  url: string;
}

interface PokemonListResponse {
  results: PokemonApiListItem[];
}

interface PokemonApiResponse {
  id: number;
  name: string;
  weight: number;
  height: number;
  sprites?: {
    front_default?: string;
  };
  types?: {
    type?: {
      name: string;
    };
  }[];
}

export const usePokemonList = (
  limit = 20,
  offset = 0,
) => {
  return useQuery({
    queryKey: ['pokemon-list', limit, offset],
    queryFn: async (): Promise<Pokemon[]> => {
      const list =
        await pokemonApi.getAll(limit, offset);

      const details = await Promise.all(
        (list as PokemonListResponse).results.map(
          async (p) => {
            const res =
              await pokemonApi.getByName(p.name);

            const data =
              res as PokemonApiResponse;

            return {
              id: data.id,
              name: data.name,
              weight: data.weight ?? 0,
              _id: `${data.id}-${data.name}`, // временный client id (не из бэка)
              sprites: {
                front_default:
                  data.sprites?.front_default ??
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`,
              },
              types: Array.isArray(data.types)
                ? data.types
                    .map((t) => t.type?.name)
                    .filter(Boolean)
                : [],
            };
          },
        ),
      );

      return details;
    },

    staleTime: 1000 * 60 * 5,
  });
};