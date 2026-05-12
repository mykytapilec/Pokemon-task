import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { usePokemonList } from '../../shared/hooks/use-pokemon';
import {
  useCollection,
  useExportCollection,
  useUpdateCollection,
} from '../../shared/hooks/use-collections';

import type { PokemonDetails } from '../../shared/types/pokemon';

export const CollectionPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: collection, isLoading } = useCollection(id!);
  const { data: pokemons = [] } = usePokemonList();

  const exportMutation = useExportCollection();
  const updateMutation = useUpdateCollection();

  const [editingName, setEditingName] = useState(false);
  const [editingPokemons, setEditingPokemons] = useState(false);

  const [name, setName] = useState('');
  const [selected, setSelected] = useState<PokemonDetails[]>([]);

  useEffect(() => {
    if (collection?.name) setName(collection.name);
    if (collection?.pokemons) setSelected(collection.pokemons);
  }, [collection]);

  const handleExport = async () => {
    if (!id || !collection) return;

    const response = await exportMutation.mutateAsync(id);

    const blob = new Blob([response.data], {
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
    if (!id || !name.trim()) return;

    await updateMutation.mutateAsync({
      id,
      data: {
        name: name.trim(),
      },
    });

    setEditingName(false);
  };

  const togglePokemon = (pokemon: PokemonDetails) => {
    setSelected((prev) => {
      const exists = prev.find((p) => p.id === pokemon.id);

      if (exists) {
        return prev.filter((p) => p.id !== pokemon.id);
      }

      return [...prev, pokemon];
    });
  };

  const handleSavePokemons = async () => {
    if (!id) return;

    await updateMutation.mutateAsync({
      id,
      data: {
        pokemons: selected.map((p) => ({
          id: p.id,
          name: p.name,
          weight: p.weight,
        })),
      },
    });

    setEditingPokemons(false);
  };

  if (isLoading || !collection) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Link to="/">← Back to Home</Link>

      {/* NAME EDIT */}
      <div style={{ marginTop: '16px' }}>
        {editingName ? (
          <>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button onClick={() => void handleRename()}>
              Save
            </button>

            <button onClick={() => setEditingName(false)}>
              Cancel
            </button>
          </>
        ) : (
          <>
            <h1>{collection.name}</h1>
            <button onClick={() => setEditingName(true)}>
              Rename
            </button>
          </>
        )}
      </div>

      {/* ACTIONS */}
      <div style={{ marginTop: '12px' }}>
        <button onClick={() => void handleExport()}>
          Download JSON
        </button>

        <button
          onClick={() => setEditingPokemons((v) => !v)}
          style={{ marginLeft: 12 }}
        >
          {editingPokemons ? 'Close Editor' : 'Edit Pokemons'}
        </button>
      </div>

      <p>Total Weight: {collection.totalWeight}</p>

      {/* POKEMONS IN COLLECTION */}
      <h3>Pokemons in collection</h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}
      >
        {selected.map((p) => (
          <div key={p.id}>
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
            />

            <h4>{p.name}</h4>

            <button
              onClick={() =>
                setSelected((prev) =>
                  prev.filter((x) => x.id !== p.id),
                )
              }
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* EDIT MODE */}
      {editingPokemons && (
        <>
          <h3 style={{ marginTop: 24 }}>
            Add / Remove Pokemons
          </h3>

          <button onClick={() => void handleSavePokemons()}>
            Save Pokemons
          </button>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginTop: 12,
            }}
          >
            {pokemons.map((p) => {
              const isSelected = selected.some(
                (x) => x.id === p.id,
              );

              return (
                <div
                  key={p.id}
                  onClick={() => togglePokemon(p)}
                  style={{
                    border: isSelected
                      ? '2px solid green'
                      : '1px solid #ccc',
                    padding: 8,
                    cursor: 'pointer',
                  }}
                >
                  <img
                    src={
                      p.sprites?.front_default ||
                      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`
                    }
                  />

                  <p>{p.name}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};