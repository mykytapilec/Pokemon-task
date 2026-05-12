import { useQuery } from '@tanstack/react-query';
import { pokemonApi } from '../api/pokemon';

export const usePokemonById = (id: number) => {
  return useQuery({
    queryKey: ['pokemon', id],
    queryFn: async () => {
      const res = await pokemonApi.getByName(String(id));

      return {
        id: res.id,
        name: res.name,
        weight: res.weight,
        height: res.height,
        sprites: res.sprites,
        types: res.types.map((t: any) => t.type?.name ?? t),
      };
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
  });
};