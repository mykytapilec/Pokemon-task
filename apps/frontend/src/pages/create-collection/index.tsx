import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { usePokemonList } from '../../shared/hooks/use-pokemon';
import { useCreateCollection } from '../../shared/hooks/use-collections';

import type { PokemonDetails } from '../../shared/types/pokemon';

import { PokemonCard } from '../../components/pokemon-card';
import { PokemonCardSkeleton } from '../../components/pokemon-card-skeleton';

import '../pages.css';

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
    <div className="page">
      <Link className="page__back" to="/">
        ← Back
      </Link>

      <h1 className="page__title">Create Collection</h1>

      <div className="page__header">
        <input
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Collection name"
        />

        <button
          className="btn btn--primary"
          onClick={() => void handleSave()}
          disabled={!isValid}
        >
          Save
        </button>
      </div>

      <div className="page__stats">
        <p>Total Weight: {totalWeight}</p>
        <p>Unique Species: {uniqueSpeciesCount}</p>
      </div>

      <div className="page__grid">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <PokemonCardSkeleton key={i} />
            ))
          : pokemons.map((pokemon: PokemonDetails) => (
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