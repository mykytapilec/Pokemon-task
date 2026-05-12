import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import { collectionsApi } from '../../shared/api/collections';

import type { Collection } from '../../shared/types/collection';

export const CollectionPage = () => {
  const { id } = useParams();

  const [collection, setCollection] =
    useState<Collection | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!id) return;

      setLoading(true);

      try {
        const data = await collectionsApi.getOne(id);
        setCollection(data);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [id]);

  const handleExport = async () => {
    if (!id || !collection) return;

    const response = await collectionsApi.exportFile(id);

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

  if (loading || !collection) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <h1>{collection.name}</h1>

      <div style={{ marginBottom: '16px' }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <button style={{ padding: '8px 12px', cursor: 'pointer' }}>
            ← Back to Home
          </button>
        </Link>

        <button
          onClick={() => void handleExport()}
          style={{
            marginLeft: '8px',
            padding: '8px 12px',
            cursor: 'pointer',
          }}
        >
          Download JSON
        </button>
      </div>

      <p>Total Weight: {collection.totalWeight}</p>

      <h3>Pokemons</h3>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}
      >
        {collection.pokemons.map((p) => (
          <div
            key={p.id}
            style={{
              border: '1px solid #ccc',
              padding: '12px',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`}
              alt={p.name}
            />

            <h4>{p.name}</h4>

            <p>{p.weight} hg</p>
          </div>
        ))}
      </div>
    </div>
  );
};