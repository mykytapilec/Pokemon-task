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

      <Link to="/create">
        Create New Collection
      </Link>

      <div
        style={{
          marginTop: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        {collections.map(
          (collection) => (
            <div
              key={collection._id}
              style={{
                border:
                  '1px solid gray',
                padding: '16px',
              }}
            >
              <h3>{collection.name}</h3>

              <p>
                Pokemons:{' '}
                {
                  collection.pokemons
                    .length
                }
              </p>

              <p>
                Total Weight:{' '}
                {
                  collection.totalWeight
                }
              </p>
            </div>
          ),
        )}
      </div>
    </div>
  );
};