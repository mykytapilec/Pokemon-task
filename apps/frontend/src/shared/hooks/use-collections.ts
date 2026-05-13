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

// GET ALL
export const useCollections = () =>
  useQuery({
    queryKey: ['collections'],
    queryFn: collectionsApi.getAll,
  });

// GET ONE
export const useCollection = (id: string) =>
  useQuery({
    queryKey: ['collection', id],
    queryFn: () => collectionsApi.getOne(id),
    enabled: !!id,
  });

// CREATE
export const useCreateCollection = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCollectionPayload) =>
      collectionsApi.create(data),

    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['collections'] });
    },
  });
};

// DELETE
export const useDeleteCollection = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => collectionsApi.remove(id),

    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ['collections'] });
    },
  });
};

// UPDATE (full replace)
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

// RENAME
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

// ADD POKEMON
export const useAddPokemonToCollection = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, pokemon }: AddPokemonInput) =>
      collectionsApi.update(id, {
        pokemons: [pokemon],
      }),

    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ['collection', vars.id],
      });
    },
  });
};

// REMOVE POKEMON
export const useRemovePokemonFromCollection = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, pokemonId }: RemovePokemonInput) => {
      const collection = await collectionsApi.getOne(id);

      const filtered = collection.pokemons.filter(
        (p) => p.id !== pokemonId,
      );

      return collectionsApi.update(id, {
        pokemons: filtered,
      });
    },

    onSuccess: (_, vars) => {
      void qc.invalidateQueries({
        queryKey: ['collection', vars.id],
      });
    },
  });
};

// EXPORT
export const useExportCollection = () =>
  useMutation({
    mutationFn: (id: string) => collectionsApi.exportFile(id),
  });

// IMPORT
export const useImportCollection = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => collectionsApi.importFile(file),

    onSuccess: () => {
      void qc.invalidateQueries({
        queryKey: ['collections'],
      });
    },
  });
};