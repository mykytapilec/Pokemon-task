import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { collectionsApi } from '../api/collections';
import type { Collection } from '../types/collection';
import type { Pokemon } from '../types/pokemon';

/* ========================= */

export const useCollections = () =>
  useQuery({
    queryKey: ['collections'],
    queryFn: collectionsApi.getAll,
  });

export const useCollection = (
  id: string,
) =>
  useQuery({
    queryKey: ['collection', id],
    queryFn: () =>
      collectionsApi.getOne(id),
    enabled: !!id,
  });


export const useCreateCollection =
  () => {
    const qc = useQueryClient();

    return useMutation({
      mutationFn:
        collectionsApi.create,

      onSuccess: () => {
        void qc.invalidateQueries({
          queryKey: ['collections'],
        });
      },
    });
  };

export const useUpdateCollection =
  () => {
    const qc = useQueryClient();

    return useMutation({
      mutationFn: ({
        id,
        data,
      }: {
        id: string;
        data: {
          name?: string;
          pokemons?: Pokemon[];
        };
      }) =>
        collectionsApi.update(
          id,
          data,
        ),

      onMutate: async ({
        id,
        data,
      }) => {
        await qc.cancelQueries({
          queryKey: [
            'collection',
            id,
          ],
        });

        const previous =
          qc.getQueryData<Collection>([
            'collection',
            id,
          ]);

        qc.setQueryData<Collection>(
          ['collection', id],
          (old) => {
            if (!old) {
              return old;
            }

            return {
              ...old,
              ...data,
            };
          },
        );

        return { previous };
      },

      onError: (
        _err,
        vars,
        ctx,
      ) => {
        if (ctx?.previous) {
          qc.setQueryData(
            ['collection', vars.id],
            ctx.previous,
          );
        }
      },

      onSettled: (
        _d,
        _e,
        vars,
      ) => {
        void qc.invalidateQueries({
          queryKey: [
            'collection',
            vars.id,
          ],
        });

        void qc.invalidateQueries({
          queryKey: ['collections'],
        });
      },
    });
  };

export const useDeleteCollection =
  () => {
    const qc = useQueryClient();

    return useMutation({
      mutationFn:
        collectionsApi.remove,

      onSuccess: () => {
        void qc.invalidateQueries({
          queryKey: ['collections'],
        });
      },
    });
  };

export const useImportCollection =
  () => {
    const qc = useQueryClient();

    return useMutation({
      mutationFn:
        collectionsApi.importFile,

      onSuccess: () => {
        void qc.invalidateQueries({
          queryKey: ['collections'],
        });
      },
    });
  };

export const useExportCollection =
  () =>
    useMutation({
      mutationFn:
        collectionsApi.exportFile,
    });

export const useAddPokemonToCollection =
  () => {
    const updateMutation =
      useUpdateCollection();

    return useMutation({
      mutationFn: async ({
        id,
        pokemon,
        currentPokemons,
      }: {
        id: string;
        pokemon: Pokemon;
        currentPokemons: Pokemon[];
      }) => {
        return updateMutation.mutateAsync(
          {
            id,
            data: {
              pokemons: [
                ...currentPokemons,
                pokemon,
              ],
            },
          },
        );
      },
    });
  };

export const useRemovePokemonFromCollection =
  () => {
    const updateMutation =
      useUpdateCollection();

    return useMutation({
      mutationFn: async ({
        id,
        pokemonId,
        currentPokemons,
      }: {
        id: string;
        pokemonId: number;
        currentPokemons: Pokemon[];
      }) => {
        return updateMutation.mutateAsync(
          {
            id,
            data: {
              pokemons:
                currentPokemons.filter(
                  (p) =>
                    p.id !==
                    pokemonId,
                ),
            },
          },
        );
      },
    });
  };