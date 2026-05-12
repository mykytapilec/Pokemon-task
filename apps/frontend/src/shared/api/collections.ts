import { api } from './client';

export const collectionsApi = {
  getAll: () => api.get('/collections'),

  getOne: (id: string) => api.get(`/collections/${id}`),

  create: (data: unknown) => api.post('/collections', data),

  remove: (id: string) => api.delete(`/collections/${id}`),

  importFile: (file: File) => {
    const formData = new FormData();

    formData.append('file', file);

    return api.post('/collections/import', formData);
  },

  exportFile: (id: string) =>
    api.get(`/collections/${id}/export`, {
      responseType: 'blob',
    }),
};