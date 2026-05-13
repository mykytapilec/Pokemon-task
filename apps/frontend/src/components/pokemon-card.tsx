import type { PokemonDetails } from '../shared/types/pokemon';
import { Card } from './card';

import './components.css';

interface Props {
  pokemon: PokemonDetails;
  selected: boolean;
  onSelect: (pokemon: PokemonDetails) => void;
}

export const PokemonCard = ({
  pokemon,
  selected,
  onSelect,
}: Props) => {
  return (
    <Card
      className={`pokemon-card ${selected ? 'pokemon-card--selected' : ''}`}
      onClick={() => onSelect(pokemon)}
    >
      <img
        className="pokemon-card__img"
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
      />

      <h3 className="pokemon-card__title">
        {pokemon.name}
      </h3>

      <p className="pokemon-card__text">
        Weight: {pokemon.weight}
      </p>

      <p className="pokemon-card__text">
        Types: {pokemon.types.join(', ')}
      </p>
    </Card>
  );
};