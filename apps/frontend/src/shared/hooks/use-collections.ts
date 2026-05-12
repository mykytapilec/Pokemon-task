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

export const useCollection = (
  id: string,
) => {
  return useQuery({
    queryKey: ['collection', id],
    queryFn: () =>
      collectionsApi.getOne(id),
    enabled: !!id,
  });
};

export const useCreateCollection = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      collectionsApi.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['collections'],
      });
    },
  });
};

export const useUpdateCollection = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        name: string;
      };
    }) =>
      collectionsApi.update(
        id,
        data,
      ),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['collections'],
      });

      queryClient.invalidateQueries({
        queryKey: [
          'collection',
          variables.id,
        ],
      });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      collectionsApi.remove,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['collections'],
      });
    },
  });
};

export const useImportCollection = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn:
      collectionsApi.importFile,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['collections'],
      });
    },
  });
};

export const useExportCollection = () => {
  return useMutation({
    mutationFn:
      collectionsApi.exportFile,
  });
};