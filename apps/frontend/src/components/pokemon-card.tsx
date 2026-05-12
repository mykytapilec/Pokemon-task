import type { PokemonDetails } from '../shared/types/pokemon';

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
    <div
      onClick={() => onSelect(pokemon)}
      style={{
        border: selected
          ? '3px solid green'
          : '1px solid gray',
        padding: '12px',
        cursor: 'pointer',
        borderRadius: '8px',
      }}
    >
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
      />

      <h3>{pokemon.name}</h3>

      <p>Weight: {pokemon.weight}</p>

      <p>
        Types: {pokemon.types.join(', ')}
      </p>
    </div>
  );
};