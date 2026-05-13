import { useQuery } from '@tanstack/react-query';
import { pokemonApi } from '../api/pokemon';

import type {
  PokemonDetails,
  PokemonListResponse,
} from '../types/pokemon';

interface PokemonApiType {
  type?: {
    name?: string;
  };
}

export const usePokemonList = (
  limit = 20,
  offset = 0,
) => {
  return useQuery({
    queryKey: [
      'pokemon-list',
      limit,
      offset,
    ],
    queryFn: async (): Promise<
      PokemonDetails[]
    > => {
      const list: PokemonListResponse =
        await pokemonApi.getAll(
          limit,
          offset,
        );

      const details: PokemonDetails[] =
        await Promise.all(
          list.results.map(
            async (p) => {
              const res =
                await pokemonApi.getByName(
                  p.name,
                );

              return {
                id: res.id,

                name: res.name,

                weight:
                  res.weight ?? 0,

                height:
                  res.height ?? 0,

                sprites: {
                  front_default:
                    res.sprites
                      ?.front_default ??
                    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${res.id}.png`,
                },
                types: Array.isArray(
                  res.types,
                )
                  ? (
                      res.types as PokemonApiType[]
                    )
                      .map(
                        (t) =>
                          t.type
                            ?.name ??
                          '',
                      )
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