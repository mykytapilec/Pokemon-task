export class CollectionValidator {
  static validate(pokemons: { name: string; weight: number }[]) {
    const species = new Set(pokemons.map((p) => p.name));

    if (species.size < 3) {
      throw new Error('At least 3 different Pokémon species required');
    }

    const totalWeight = pokemons.reduce((sum, p) => sum + p.weight, 0);

    if (totalWeight > 1300) {
      throw new Error('Total weight exceeds 1300 hectograms limit');
    }

    return {
      totalWeight,
    };
  }
}
