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

    if (totalWeight > 1300) {
      throw new Error('total weight exceeds limit');
    }

    const uniqueSpeciesCount = new Set(pokemons.map((p) => p.name)).size;

    if (uniqueSpeciesCount < 3) {
      throw new Error('collection must contain at least 3 unique pokemon');
    }

    return {
      pokemons,
      totalWeight,
    };
  }
}
