import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  useAddPokemonToCollection,
  useCollection,
  useExportCollection,
  useRemovePokemonFromCollection,
  useRenameCollection,
} from '../../shared/hooks/use-collections';

import { usePokemonList } from '../../shared/hooks/use-pokemon';

import type { Pokemon, PokemonDetails } from '../../shared/types/pokemon';

export const CollectionPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: collection, isLoading } = useCollection(id ?? '');
  const { data: availablePokemons = [] } = usePokemonList();

  const exportMutation = useExportCollection();
  const renameMutation = useRenameCollection();
  const addPokemonMutation = useAddPokemonToCollection();
  const removePokemonMutation = useRemovePokemonFromCollection();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');

  // sync name safely
  useEffect(() => {
    if (collection?.name) {
      setName(collection.name);
    }
  }, [collection?.name]);

  const selected = useMemo<Pokemon[]>(
    () => collection?.pokemons ?? [],
    [collection],
  );

  const totalWeight = useMemo(
    () => selected.reduce((sum, p) => sum + p.weight, 0),
    [selected],
  );

  const uniqueSpeciesCount = useMemo(
    () => new Set(selected.map((p) => p.name)).size,
    [selected],
  );

  const availableToAdd = availablePokemons.filter(
    (p: PokemonDetails) => !selected.some((sp) => sp.id === p.id),
  );

  const handleExport = async () => {
    if (!id || !collection) return;

    const response = await exportMutation.mutateAsync(id);

    const blob = new Blob([JSON.stringify(response.data)], {
      type: 'application/json',
    });

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `${collection.name}.json`;
    a.click();

    window.URL.revokeObjectURL(url);
  };

  const handleRename = () => {
    if (!id) return;

    renameMutation.mutate({
      id,
      name: name.trim(),
    });

    setEditing(false);
  };

  const handleAddPokemon = (pokemon: PokemonDetails) => {
    if (!id) return;

    addPokemonMutation.mutate({
      id,
      pokemon: {
        id: pokemon.id,
        name: pokemon.name,
        weight: pokemon.weight,
      },
    });
  };

  const handleRemovePokemon = (pokemonId: number) => {
    if (!id) return;

    removePokemonMutation.mutate({
      id,
      pokemonId,
    });
  };

  if (isLoading || !collection) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Link to="/">← Back</Link>

      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        {editing ? (
          <>
            <input value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={handleRename}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <h1>{collection.name}</h1>
            <button onClick={() => setEditing(true)}>Rename</button>
          </>
        )}
      </div>

      <button onClick={() => void handleExport()}>Export JSON</button>

      <p>Total Weight: {totalWeight}</p>
      <p>Unique Species: {uniqueSpeciesCount}</p>

      <h2>Pokemons</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {selected.map((p) => (
          <div key={p.id}>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
            />
            <h4>{p.name}</h4>
            <p>{p.weight}</p>

            <button onClick={() => handleRemovePokemon(p.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <h2>Add Pokemons</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {availableToAdd.map((p) => (
          <div key={p.id}>
            <img src={p.sprites.front_default} />
            <p>{p.name}</p>

            <button onClick={() => handleAddPokemon(p)}>
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};