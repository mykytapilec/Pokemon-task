import {
  useEffect,
  useState,
} from 'react';

import { Link } from 'react-router-dom';

import { collectionsApi } from '../../shared/api/collections';

import type { Collection } from '../../shared/types/collection';

export const HomePage = () => {
  const [collections, setCollections] =
    useState<Collection[]>([]);

  useEffect(() => {
    const load = async () => {
      const data =
        await collectionsApi.getAll();

      setCollections(data);
    };

    void load();
  }, []);

  return (
    <div style={{ padding: '24px' }}>
      <h1>Pokemon Collections</h1>

      <div style={{ marginBottom: '16px' }}>
        <Link to="/create">
          Create New Collection
        </Link>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {collections.map((collection) => (
          <Link
            key={collection._id}
            to={`/collections/${collection._id}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div
              style={{
                border:
                  '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                transition:
                  'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background =
                  '#f5f5f5';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background =
                  'white';
              }}
            >
              <h3 style={{ margin: 0 }}>
                {collection.name}
              </h3>

              <p style={{ margin: '8px 0 0' }}>
                Pokemons:{' '}
                {collection.pokemons.length}
              </p>

              <p style={{ margin: 0 }}>
                Total Weight:{' '}
                {collection.totalWeight}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};