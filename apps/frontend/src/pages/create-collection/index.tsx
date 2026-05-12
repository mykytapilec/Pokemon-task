import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { Link, useNavigate } from 'react-router-dom';

import { pokemonApi } from '../../shared/api/pokemon';
import { collectionsApi } from '../../shared/api/collections';

import type { PokemonDetails } from '../../shared/types/pokemon';

import { PokemonCard } from '../../features/pokemon-catalog/pokemon-card';

export const CreateCollectionPage = () => {
  const navigate = useNavigate();

  const [pokemons, setPokemons] = useState<
    PokemonDetails[]
  >([]);

  const [selected, setSelected] = useState<
    PokemonDetails[]
  >([]);

  const [name, setName] = useState('');

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    const load = async () => {
      const list = await pokemonApi.getAll(
        20,
        0,
      );

      const details = await Promise.all(
        list.results.map((pokemon) =>
          pokemonApi.getByName(
            pokemon.name,
          ),
        ),
      );

      setPokemons(details);
    };

    void load();
  }, []);

  const totalWeight = useMemo(() => {
    return selected.reduce(
      (sum, pokemon) =>
        sum + pokemon.weight,
      0,
    );
  }, [selected]);

  const uniqueSpeciesCount = useMemo(() => {
    return new Set(
      selected.map(
        (pokemon) => pokemon.name,
      ),
    ).size;
  }, [selected]);

  const isValid =
    totalWeight <= 1300 &&
    uniqueSpeciesCount >= 3 &&
    name.trim().length > 0;

  const togglePokemon = (
    pokemon: PokemonDetails,
  ) => {
    const exists = selected.find(
      (p) => p.id === pokemon.id,
    );

    if (exists) {
      setSelected((prev) =>
        prev.filter(
          (p) => p.id !== pokemon.id,
        ),
      );

      return;
    }

    setSelected((prev) => [
      ...prev,
      pokemon,
    ]);
  };

  const handleSave = async () => {
    if (!isValid) {
      return;
    }

    try {
      setLoading(true);

      await collectionsApi.create({
        name,
        pokemons: selected.map(
          (pokemon) => ({
            id: pokemon.id,
            name: pokemon.name,
            weight: pokemon.weight,
          }),
        ),
      });

      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>Create Collection</h1>

      <div style={{ marginBottom: '16px' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button
            style={{
              padding: '8px 12px',
              cursor: 'pointer',
            }}
          >
            ← Back to Home
          </button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Collection name"
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
        style={{
          padding: '8px',
          marginBottom: '16px',
          width: '300px',
        }}
      />

      <p>Total Weight: {totalWeight}</p>

      <p>
        Unique Species:{' '}
        {uniqueSpeciesCount}
      </p>

      {totalWeight > 1300 && (
        <p style={{ color: 'red' }}>
          Weight limit exceeded
        </p>
      )}

      {uniqueSpeciesCount < 3 && (
        <p style={{ color: 'red' }}>
          At least 3 different species
          required
        </p>
      )}

      <button
        onClick={() => {
          void handleSave();
        }}
        disabled={!isValid || loading}
        style={{
          marginBottom: '24px',
          padding: '12px 16px',
        }}
      >
        {loading
          ? 'Saving...'
          : 'Save Collection'}
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(4, 1fr)',
          gap: '16px',
        }}
      >
        {pokemons.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            selected={selected.some(
              (p) =>
                p.id === pokemon.id,
            )}
            onSelect={togglePokemon}
          />
        ))}
      </div>
    </div>
  );
};