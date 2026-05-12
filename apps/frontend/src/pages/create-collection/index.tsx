import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { usePokemonList } from '../../shared/hooks/use-pokemon';
import { useCreateCollection } from '../../shared/hooks/use-collections';

import type { PokemonDetails } from '../../shared/types/pokemon';
import { PokemonCard } from '../../components/pokemon-card';
import { PokemonCardSkeleton } from '../../components/pokemon-card-skeleton';

export const CreateCollectionPage = () => {
  const navigate = useNavigate();

  const { data: pokemons = [], isLoading } = usePokemonList();
  const createMutation = useCreateCollection();

  const [selected, setSelected] = useState<PokemonDetails[]>([]);
  const [name, setName] = useState('');

  const totalWeight = useMemo(
    () => selected.reduce((sum, p) => sum + p.weight, 0),
    [selected],
  );

  const uniqueSpeciesCount = useMemo(
    () => new Set(selected.map((p) => p.name)).size,
    [selected],
  );

  const isValid =
    totalWeight <= 1300 &&
    uniqueSpeciesCount >= 3 &&
    name.trim().length > 0;

  const togglePokemon = (pokemon: PokemonDetails) => {
    const exists = selected.find((p) => p.id === pokemon.id);

    if (exists) {
      setSelected((prev) => prev.filter((p) => p.id !== pokemon.id));
      return;
    }

    setSelected((prev) => [...prev, pokemon]);
  };

  const handleSave = async () => {
    if (!isValid) return;

    await createMutation.mutateAsync({
      name,
      pokemons: selected.map((p) => ({
        id: p.id,
        name: p.name,
        weight: p.weight,
      })),
    });

    navigate('/');
  };

  return (
    <div style={{ padding: '24px' }}>
      <Link to="/">← Back to Home</Link>

      <h1>Create Collection</h1>

      <input
        type="text"
        placeholder="Collection name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          padding: '8px',
          marginBottom: '16px',
          width: '300px',
        }}
      />

      <p>Total Weight: {totalWeight}</p>
      <p>Unique Species: {uniqueSpeciesCount}</p>

      {!isValid && (
        <p style={{ color: '#999' }}>
          Fill name + select 3+ Pokémon under weight limit
        </p>
      )}

      {isLoading && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
          }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <PokemonCardSkeleton key={i} />
          ))}
        </div>
      )}

      <button
        onClick={() => void handleSave()}
        disabled={!isValid || createMutation.isPending}
        style={{
          marginBottom: '24px',
          padding: '12px 16px',
        }}
      >
        {createMutation.isPending ? 'Saving...' : 'Save Collection'}
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}
      >
        {pokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            selected={selected.some((p) => p.id === pokemon.id)}
            onSelect={togglePokemon}
          />
        ))}
      </div>
    </div>
  );
};