type PokemonInput = {
  id: number;
  name: string;
  weight: number;
};

type ValidateInput = {
  pokemons: unknown;
};

export class CollectionValidator {
  static validate(data: ValidateInput) {
    const pokemonsRaw = data.pokemons;

    if (!Array.isArray(pokemonsRaw)) {
      throw new Error('pokemons must be array');
    }

    const pokemons: PokemonInput[] = pokemonsRaw.map((p) => {
      const item = p as PokemonInput;

      return {
        id: item.id,
        name: item.name,
        weight: item.weight,
      };
    });

    const totalWeight = pokemons.reduce((sum, p) => sum + p.weight, 0);

    return {
      pokemons,
      totalWeight,
    };
  }
}
