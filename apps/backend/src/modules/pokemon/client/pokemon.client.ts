import axios from 'axios';

export interface RawPokemonListResponse {
  count: number;
  results: {
    name: string;
    url: string;
  }[];
}

export interface RawPokemonDetails {
  id: number;
  name: string;
  weight: number;
  height: number;
  sprites: Record<string, unknown>;
  types: {
    type: {
      name: string;
    };
  }[];
}

export class PokemonClient {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';

  async getPokemonList(
    limit: number,
    offset: number,
  ): Promise<RawPokemonListResponse> {
    const res = await axios.get<RawPokemonListResponse>(
      `${this.baseUrl}/pokemon`,
      {
        params: { limit, offset },
      },
    );

    return res.data;
  }

  async getPokemonByName(name: string): Promise<RawPokemonDetails> {
    const res = await axios.get<RawPokemonDetails>(
      `${this.baseUrl}/pokemon/${name}`,
    );

    return res.data;
  }
}
