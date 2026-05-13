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

    try {
      await createMutation.mutateAsync({
        name,
        pokemons: selected.map((p) => ({
          id: p.id,
          name: p.name,
          weight: p.weight,
        })),
      });

      void navigate('/');
    } catch (err) {
      console.error('Create failed:', err);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Link to="/">← Back to Home</Link>

      <h1>Create Collection</h1>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Collection name"
      />

      <button onClick={() => void handleSave()} disabled={!isValid}>
        Save Collection
      </button>

      {isLoading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <PokemonCardSkeleton key={i} />
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
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