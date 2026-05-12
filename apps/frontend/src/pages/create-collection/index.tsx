import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { usePokemonList } from '../../shared/hooks/use-pokemon';
import { useCreateCollection, useImportCollection } from '../../shared/hooks/use-collections';

import type { PokemonDetails } from '../../shared/types/pokemon';
import { PokemonCard } from '../../features/pokemon-catalog/pokemon-card';

export const CreateCollectionPage = () => {
  const navigate = useNavigate();

  const { data: pokemons = [], isLoading } = usePokemonList();

  const createMutation = useCreateCollection();
  const importMutation = useImportCollection();

  const [selected, setSelected] = useState<PokemonDetails[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState('');

  const totalWeight = useMemo(() => {
    return selected.reduce((sum, pokemon) => sum + pokemon.weight, 0);
  }, [selected]);

  const uniqueSpeciesCount = useMemo(() => {
    return new Set(selected.map((p) => p.name)).size;
  }, [selected]);

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
      pokemons: selected.map((pokemon) => ({
        id: pokemon.id,
        name: pokemon.name,
        weight: pokemon.weight,
      })),
    });

    navigate('/');
  };

  const handleImport = async () => {
    if (!file) return;

    await importMutation.mutateAsync(file);

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

      <div style={{ marginBottom: '16px' }}>
        <input
          type="file"
          accept="application/json"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <button
          onClick={() => void handleImport()}
          style={{ marginLeft: '8px' }}
        >
          Import Collection
        </button>
      </div>

      {isLoading && <p>Loading Pokémon...</p>}

      {totalWeight > 1300 && (
        <p style={{ color: 'red' }}>Weight limit exceeded</p>
      )}

      {uniqueSpeciesCount < 3 && (
        <p style={{ color: 'red' }}>
          At least 3 different species required
        </p>
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