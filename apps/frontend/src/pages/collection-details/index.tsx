import { useParams, Link } from 'react-router-dom';

import {
  useCollection,
  useExportCollection,
} from '../../shared/hooks/use-collections';

export const CollectionPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: collection, isLoading } = useCollection(id!);
  const exportMutation = useExportCollection();

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

  if (isLoading || !collection) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '24px' }}>
      <Link to="/">← Back to Home</Link>

      <h1>{collection.name}</h1>

      <div style={{ marginBottom: '16px' }}>
        <button onClick={() => void handleExport()}>
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