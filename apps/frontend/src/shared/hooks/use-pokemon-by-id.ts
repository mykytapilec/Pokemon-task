import { useQuery } from '@tanstack/react-query';

import { pokemonApi } from '../api/pokemon';

import type { PokemonDetails } from '../types/pokemon';

interface PokemonApiType {
  type?: {
    name?: string;
  };
}

export const usePokemonById = (
  id: number,
) => {
  return useQuery({
    queryKey: ['pokemon', id],

    queryFn: async (): Promise<PokemonDetails> => {
      const res =
        await pokemonApi.getByName(
          String(id),
        );

      return {
        id: res.id,
        name: res.name,
        weight: res.weight ?? 0,
        height: res.height ?? 0,
        sprites: {
          front_default:
            res.sprites
              ?.front_default ?? '',
        },
        types: Array.isArray(res.types)
          ? (
              res.types as PokemonApiType[]
            )
              .map(
                (t) =>
                  t.type?.name ?? '',
              )
              .filter(Boolean)
          : [],
      };
    },
    enabled: !!id,
    staleTime:
      1000 * 60 * 60,
  });
};