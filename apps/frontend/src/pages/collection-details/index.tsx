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
import { PageLoader } from '../../components/page-loader';

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(collection?.name ?? '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection?._id]);

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

    const blob = await exportMutation.mutateAsync(id);

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
    return <PageLoader lines={5} height={28} />;
  }

  return (
    <div className="page">
        <Link className="page__back" to="/">
        ← Back
        </Link>

        <div className="page__header">
        {editing ? (
            <>
            <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <button className="btn btn--primary" onClick={handleRename}>
                Save
            </button>

            <button className="btn btn--ghost" onClick={() => setEditing(false)}>
                Cancel
            </button>
            </>
        ) : (
            <>
            <h1 className="page__title">{collection.name}</h1>

            <button className="btn btn--ghost" onClick={() => setEditing(true)}>
                Rename
            </button>
            </>
        )}

        <button className="btn btn--ghost" onClick={() => void handleExport()}>
            Export JSON
        </button>
        </div>

        <div className="page__stats">
        <p>Total Weight: {totalWeight}</p>
        <p>Unique Species: {uniqueSpeciesCount}</p>
        </div>

        <h2 className="page__subtitle">Pokemons</h2>

        <div className="page__grid">
        {selected.map((p) => (
            <div key={p.id} className="page__card">
            <img
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
            />
            <h4>{p.name}</h4>
            <p>{p.weight}</p>

            <button className="btn btn--danger" onClick={() => handleRemovePokemon(p.id)}>
                Remove
            </button>
            </div>
        ))}
        </div>

        <h2 className="page__subtitle">Add Pokemons</h2>

        <div className="page__grid">
        {availableToAdd.map((p) => (
            <div key={p.id} className="page__card">
            <img src={p.sprites.front_default} />
            <p>{p.name}</p>

            <button className="btn btn--primary" onClick={() => handleAddPokemon(p)}>
                Add
            </button>
            </div>
        ))}
        </div>
    </div>
  );
};