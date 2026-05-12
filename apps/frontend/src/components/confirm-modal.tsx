type Props = {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmModal = ({
  open,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: Props) => {
  if (!open) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '12px',
          width: '320px',
        }}
      >
        <h3>{title}</h3>
        <p>{description}</p>

        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px',
            marginTop: '16px',
          }}
        >
          <button onClick={onCancel}>{cancelText}</button>

          <button
            onClick={onConfirm}
            style={{
              background: '#ff4d4f',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};