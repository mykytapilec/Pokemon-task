import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
};

export const useDeleteCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: collectionsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
};

export const useImportCollection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: collectionsApi.importFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collections'] });
    },
  });
};

export const useExportCollection = () => {
  return useMutation({
    mutationFn: collectionsApi.exportFile,
  });
};