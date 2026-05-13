import { Link } from 'react-router-dom';
import { useState } from 'react';

import { CollectionCard } from '../../components/collection-card';
import { ConfirmModal } from '../../components/confirm-modal';

import {
  useCollections,
  useDeleteCollection,
  useImportCollection,
} from '../../shared/hooks/use-collections';

import { PageLoader } from '../../components/page-loader';

import '../pages.css';

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
    <div className="page">
      <h1 className="page__title">Pokemon Collections</h1>

      <div className="home-actions">
        <Link className="btn btn--primary" to="/create">
          Create New Collection
        </Link>

        <input
          className="input"
          type="file"
          accept="application/json"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setFile(e.target.files[0]);
            }
          }}
        />

        <button
          className="btn btn--ghost"
          onClick={() => void handleImport()}
          disabled={!file || importMutation.isPending}
        >
          {importMutation.isPending ? 'Importing...' : 'Import Collection'}
        </button>
      </div>

      {isLoading && <PageLoader lines={6} height={80} />}

      {!isLoading && collections.length === 0 && (
        <p className="page__stats">
          No collections yet. Create your first one.
        </p>
      )}

      <div className="home-list">
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