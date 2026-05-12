import {
  useEffect,
  useState,
} from 'react';

import { useParams, Link } from 'react-router-dom';

import { collectionsApi } from '../../shared/api/collections';

import type { Collection } from '../../shared/types/collection';

export const CollectionPage = () => {
  const { id } = useParams();

  const [collection, setCollection] =
    useState<Collection | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      const data =
        await collectionsApi.getOne(id);

      setCollection(data);
    };

    void load();
  }, [id]);

  if (!collection) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>{collection.name}</h1>

      <Link to="/" style={{ textDecoration: 'none' }}>
        <button
            style={{
            marginBottom: '16px',
            padding: '8px 12px',
            cursor: 'pointer',
            }}
        >
            ← Back to Home
        </button>
      </Link>

      <p>
        Total Weight:{' '}
        {collection.totalWeight}
      </p>

      <h3>Pokemons</h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns:
            'repeat(4, 1fr)',
          gap: '16px',
        }}
      >
        {collection.pokemons.map(
          (p) => (
            <div
              key={p.id}
              style={{
                border:
                  '1px solid #ccc',
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <img
                src={
                  // fallback safety
                  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`
                }
                alt={p.name}
              />

              <h4>{p.name}</h4>

              <p>{p.weight} hg</p>
            </div>
          ),
        )}
      </div>
    </div>
  );
};