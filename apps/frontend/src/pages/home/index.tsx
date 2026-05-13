import { Link } from 'react-router-dom';
import { useState } from 'react';

import { CollectionCard } from '../../components/collection-card';
import { ConfirmModal } from '../../components/confirm-modal';

import {
  useCollections,
  useDeleteCollection,
  useImportCollection,
} from '../../shared/hooks/use-collections';

export const HomePage = () => {
  const { data: collections = [], isLoading } = useCollections();

  const deleteMutation = useDeleteCollection();
  const importMutation = useImportCollection();

  const [file, setFile] = useState<File | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    await deleteMutation.mutateAsync(deleteId);
    setDeleteId(null);
  };

  const handleImport = async () => {
    if (!file) return;

    await importMutation.mutateAsync(file);
    setFile(null);
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>Pokemon Collections</h1>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <Link to="/create">Create New Collection</Link>

        <input
          type="file"
          accept="application/json"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <button onClick={() => void handleImport()} disabled={!file || importMutation.isPending}>
          {importMutation.isPending ? 'Importing...' : 'Import Collection'}
        </button>
      </div>

      {isLoading && <p>Loading collections...</p>}

      {!isLoading && collections.length === 0 && (
        <p>No collections yet. Create your first one.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {collections.map((collection) => (
          <CollectionCard
            key={collection._id}
            collection={collection}
            loading={deleteMutation.isPending}
            onDelete={(id) => setDeleteId(id)}
          />
        ))}
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Delete collection?"
        description="This action cannot be undone."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
};