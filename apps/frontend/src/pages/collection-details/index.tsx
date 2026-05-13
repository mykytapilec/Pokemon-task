import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import {
  useAddPokemonToCollection,
  useCollection,
  useExportCollection,
  useRemovePokemonFromCollection,
  useUpdateCollection,
} from '../../shared/hooks/use-collections';

import { usePokemonList } from '../../shared/hooks/use-pokemon';

import type { Pokemon, PokemonDetails } from '../../shared/types/pokemon';

export const CollectionPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: collection, isLoading } = useCollection(id ?? '');
  const { data: availablePokemons = [] } = usePokemonList();

  const exportMutation = useExportCollection();
  const updateMutation = useUpdateCollection();
  const addPokemonMutation = useAddPokemonToCollection();
  const removePokemonMutation = useRemovePokemonFromCollection();

  const [editing, setEditing] = useState(false);
  const [localName, setLocalName] = useState('');

  const selected: Pokemon[] = useMemo(
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

  const availableToAdd: PokemonDetails[] = availablePokemons.filter(
    (p) => !selected.some((sp) => sp.id === p.id),
  );

  const startEdit = () => {
    setLocalName(collection?.name ?? '');
    setEditing(true);
  };

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

  const handleRename = async () => {
    if (!id || !collection) return;

    await updateMutation.mutateAsync({
      id,
      data: {
        name: localName.trim(),
        pokemons: selected.map(({ id, name, weight }) => ({
            id,
            name,
            weight,
        }))
      },
    });

    setEditing(false);
  };

  const handleRemovePokemon = (pokemonId: number) => {
    if (!id || !collection) return;

    removePokemonMutation.mutate({
      id,
      pokemonId,
      currentPokemons: selected,
    });
  };

  const handleAddPokemon = (pokemon: PokemonDetails) => {
    if (!id || !collection) return;

    addPokemonMutation.mutate({
      id,
      pokemon: {
        id: pokemon.id,
        name: pokemon.name,
        weight: pokemon.weight,
      },
      currentPokemons: selected,
    });
  };

  if (isLoading || !collection) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Link to="/">← Back to Home</Link>

      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        {editing ? (
          <>
            <input
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
            />
            <button onClick={() => void handleRename()}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <h1>{collection.name}</h1>
            <button onClick={startEdit}>Rename</button>
          </>
        )}
      </div>

      <button onClick={() => void handleExport()}>
        Download JSON
      </button>

      <p>Total Weight: {totalWeight}</p>
      <p>Unique Species: {uniqueSpeciesCount}</p>

      <h2>Pokemons in Collection</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {selected.map((p) => (
          <div key={p.id}>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
            />
            <h4>{p.name}</h4>
            <p>{p.weight} hg</p>

            <button onClick={() => handleRemovePokemon(p.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <h2>Add More Pokemons</h2>

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