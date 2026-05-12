import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { collectionsApi } from '../../shared/api/collections';
import type { Collection } from '../../shared/types/collection';

import { CollectionCard } from '../../components/collection-card';
import { ConfirmModal } from '../../components/confirm-modal';

export const HomePage = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadCollections = async () => {
    const data = await collectionsApi.getAll();
    setCollections(data);
  };

  useEffect(() => {
    void loadCollections();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setLoadingId(deleteId);
      await collectionsApi.remove(deleteId);
      await loadCollections();
    } finally {
      setLoadingId(null);
      setDeleteId(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      await collectionsApi.importFile(file);
      await loadCollections();
      setFile(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>Pokemon Collections</h1>

      {/* CREATE + IMPORT BAR */}
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

        <button onClick={handleImport} disabled={!file}>
          Import Collection
        </button>
      </div>

      {/* LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {collections.map((collection) => (
          <CollectionCard
            key={collection._id}
            collection={collection}
            loading={loadingId === collection._id}
            onDelete={(id) => setDeleteId(id)}
          />
        ))}
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={!!deleteId}
        title="Delete collection?"
        description="This will permanently remove the collection."
        onCancel={() => setDeleteId(null)}
        onConfirm={() => void handleDelete()}
      />
    </div>
  );
};