import { api } from './client';

import type {
  Collection,
  CreateCollectionPayload,
} from '../types/collection';

export const collectionsApi = {
  getAll: async (): Promise<Collection[]> => {
    const response =
      await api.get<Collection[]>('/collections');

    return response.data;
  },

  getOne: async (
    id: string,
  ): Promise<Collection> => {
    const response =
      await api.get<Collection>(
        `/collections/${id}`,
      );

    return response.data;
  },

  create: async (
    data: CreateCollectionPayload,
  ): Promise<Collection> => {
    const response =
      await api.post<Collection>(
        '/collections',
        data,
      );

    return response.data;
  },

  remove: async (id: string) => {
    return api.delete(`/collections/${id}`);
  },

  importFile: async (file: File) => {
    const formData = new FormData();

    formData.append('file', file);

    return api.post(
      '/collections/import',
      formData,
    );
  },

  exportFile: async (id: string) => {
    return api.get(
      `/collections/${id}/export`,
      {
        responseType: 'blob',
      },
    );
  },
};