import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { collectionsApi } from '../api/collections';

import type {
  CreateCollectionPayload,
  UpdateCollectionPayload,
} from '../types/collection';

type AddPokemonInput = {
  id: string;
  pokemon: {
    id: number;
    name: string;
    weight: number;
  };
};

type RemovePokemonInput = {
  id: string;
  pokemonId: number;
};

type RenameInput = {
  id: string;
  name: string;
};

export const useCollections = () =>
  useQuery({
    queryKey: ['collections'],
    queryFn: collectionsApi.getAll,
  });

export const useCollection = (id: string) =>
  useQuery({
    queryKey: ['collection', id],
    queryFn: () => collectionsApi.getOne(id),
    enabled: !!id,
  });

export const useCreateCollection = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollectionPayload) =>
      collectionsApi.create(data),

    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ['collections'],
      });
    },
  });
};

export const useDeleteCollection = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      collectionsApi.remove(id),

    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ['collections'],
      });
    },
  });
};

export const useUpdateCollection = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCollectionPayload;
    }) => collectionsApi.update(id, data),

    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ['collection', vars.id],
      });

      void qc.invalidateQueries({
        queryKey: ['collections'],
      });
    },
  });
};

export const useRenameCollection = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, name }: RenameInput) =>
      collectionsApi.update(id, { name }),

    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ['collection', vars.id],
      });

      void qc.invalidateQueries({
        queryKey: ['collections'],
      });
    },
  });
};

export const useAddPokemonToCollection = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, pokemon }: AddPokemonInput) => {
      const current = await collectionsApi.getOne(id);

      return collectionsApi.update(id, {
        pokemons: [
          ...current.pokemons.map((p) => ({
            id: p.id,
            name: p.name,
            weight: p.weight,
          })),
          {
            id: pokemon.id,
            name: pokemon.name,
            weight: pokemon.weight,
          },
        ],
      });
    },

    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ['collection', vars.id],
      });
    },
  });
};

export const useRemovePokemonFromCollection = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      pokemonId,
    }: RemovePokemonInput) => {
      const current = await collectionsApi.getOne(id);

      return collectionsApi.update(id, {
        pokemons: current.pokemons
          .filter((p) => p.id !== pokemonId)
          .map((p) => ({
            id: p.id,
            name: p.name,
            weight: p.weight,
          })),
      });
    },

    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ['collection', vars.id],
      });
    },
  });
};

export const useExportCollection = () =>
  useMutation({
    mutationFn: (id: string) =>
      collectionsApi.exportFile(id),
  });

export const useImportCollection = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      collectionsApi.importFile(file),

    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ['collections'],
      });
    },
  });
};