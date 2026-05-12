import { useQuery } from '@tanstack/react-query';
import { pokemonApi } from '../api/pokemon';

export const usePokemonList = (limit = 20, offset = 0) => {
  return useQuery({
    queryKey: ['pokemon-list', limit, offset],
    queryFn: async () => {
      const res = await pokemonApi.getAll(limit, offset);

      return res.results.map((p, index) => ({
        id: index + 1,
        name: p.name,
        weight: 0,
        height: 0,
        sprites: {
          front_default: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
        },
        types: [],
      }));
    },
    staleTime: 1000 * 60 * 5,
  });
};