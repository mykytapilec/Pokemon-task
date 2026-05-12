import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { collectionsApi } from '../api/collections';

export const useCollections = () => {
  return useQuery({
    queryKey: ['collections'],
    queryFn: collectionsApi.getAll,
  });
};

export const useCollection = (id: string) => {
  return useQuery({
    queryKey: ['collection', id],
    queryFn: () => collectionsApi.getOne(id),
    enabled: !!id,
  });
};

export const useCreateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: collectionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['collections'],
      });
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: {
      id: string;
      data: {
        name?: string;
        pokemons?: any[];
      };
    }) => collectionsApi.update(id, data),

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['collection', id] });

      const previous = queryClient.getQueryData(['collection', id]);

      queryClient.setQueryData(['collection', id], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          ...data,
        };
      });

      return { previous };
    },

    onError: (_err, variables, context: any) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ['collection', variables.id],
          context.previous,
        );
      }
    },

    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['collection', variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ['collections'],
      });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: collectionsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['collections'],
      });
    },
  });
};

export const useImportCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: collectionsApi.importFile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['collections'],
      });
    },
  });
};

export const useExportCollection = () => {
  return useMutation({
    mutationFn: collectionsApi.exportFile,
  });
};

/* ================================
   🧩 COLLECTION ACTION HELPERS
   ================================ */

export const useAddPokemonToCollection = () => {
  const update = useUpdateCollection();

  return {
    mutate: ({
      id,
      pokemon,
      currentPokemons,
    }: {
      id: string;
      pokemon: any;
      currentPokemons: any[];
    }) => {
      update.mutate({
        id,
        data: {
          pokemons: [...currentPokemons, pokemon],
        },
      });
    },
  };
};

export const useRemovePokemonFromCollection = () => {
  const update = useUpdateCollection();

  return {
    mutate: ({
      id,
      pokemonId,
      currentPokemons,
    }: {
      id: string;
      pokemonId: number;
      currentPokemons: any[];
    }) => {
      update.mutate({
        id,
        data: {
          pokemons: currentPokemons.filter(
            (p) => p.id !== pokemonId,
          ),
        },
      });
    },
  };
};