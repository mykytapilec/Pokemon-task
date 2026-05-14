import { api } from './client';

import type {
  Collection,
  CreateCollectionPayload,
  UpdateCollectionPayload,
} from '../types/collection';

import type { Pokemon } from '../types/pokemon';

export const collectionsApi = {
  // GET ALL
  getAll: async (): Promise<Collection[]> => {
    const res = await api.get<Collection[]>('/collections');
    return res.data;
  },

  // GET ONE
  getOne: async (id: string): Promise<Collection> => {
    const res = await api.get<Collection>(`/collections/${id}`);
    return res.data;
  },

  // CREATE
  create: async (data: CreateCollectionPayload): Promise<Collection> => {
    const res = await api.post<Collection>('/collections', data);
    return res.data;
  },

  // UPDATE (rename + full replace)
  update: async (
    id: string,
    data: UpdateCollectionPayload,
  ): Promise<Collection> => {
    const res = await api.patch<Collection>(`/collections/${id}`, data);
    return res.data;
  },

  // DELETE COLLECTION
  remove: async (id: string): Promise<void> => {
    await api.delete(`/collections/${id}`);
  },

  // ➕ ADD POKEMON (NEW CONTRACT)
  addPokemon: async (id: string, pokemon: Pokemon): Promise<Collection> => {
    const res = await api.post<Collection>(
      `/collections/${id}/pokemons`,
      pokemon,
    );
    return res.data;
  },

  removePokemon: async (id: string, pokemonId: number): Promise<Collection> => {
    const res = await api.delete<Collection>(
      `/collections/${id}/pokemons/${pokemonId}`,
    );
    return res.data;
  },

  exportFile: async (id: string): Promise<Blob> => {
    const res = await api.get<Blob>(`/collections/${id}/export`, {
      responseType: 'blob',
    });

    return res.data;
  },

  importFile: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    await api.post('/collections/import', formData);
  },
};