import { Link } from 'react-router-dom';

import type { Collection } from '../shared/types/collection';

import { Card } from './card';
import { Button } from './button';

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
    <Card className="collection-card">
      <Link
        to={`/collections/${collection._id}`}
        className="collection-card__link"
      >
        <div>
          <h3 className="collection-card__title">
            {collection.name}
          </h3>

          <p className="collection-card__text">
            Pokemons: {collection.pokemons.length}
          </p>

          <p className="collection-card__text">
            Total Weight: {collection.totalWeight}
          </p>
        </div>
      </Link>

      <Button
        variant="danger"
        onClick={() => onDelete(collection._id)}
        disabled={loading}
      >
        {loading ? 'Deleting...' : 'Delete'}
      </Button>
    </Card>
  );
};