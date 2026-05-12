import { api } from './client';

export const pokemonApi = {
  getAll: (limit = 20, offset = 0) =>
    api.get(`/pokemon?limit=${limit}&offset=${offset}`),

  getByName: (name: string) =>
    api.get(`/pokemon/${name}`),
};