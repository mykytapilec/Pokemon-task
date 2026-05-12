import { Link } from 'react-router-dom';
import type { Collection } from '../shared/types/collection';

type Props = {
  collection: Collection;
  onDelete: (id: string) => void;
  loading?: boolean;
};

export const CollectionCard = ({
  collection,
  onDelete,
  loading,
}: Props) => {
  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      <Link
        to={`/collections/${collection._id}`}
        style={{
          textDecoration: 'none',
          color: 'inherit',
          flex: 1,
        }}
      >
        <div>
          <h3 style={{ margin: 0 }}>{collection.name}</h3>

          <p style={{ margin: '8px 0 0' }}>
            Pokemons: {collection.pokemons.length}
          </p>

          <p style={{ margin: 0 }}>
            Total Weight: {collection.totalWeight}
          </p>
        </div>
      </Link>

      <button
        onClick={() => onDelete(collection._id)}
        disabled={loading}
        style={{
          padding: '8px 12px',
          cursor: 'pointer',
          background: '#ff4d4f',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
        }}
      >
        {loading ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  );
};