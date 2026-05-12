export const Skeleton = ({ height = 80 }: { height?: number }) => {
  return (
    <div
      style={{
        height,
        background: '#eee',
        borderRadius: '8px',
        animation: 'pulse 1.5s infinite',
      }}
    />
  );
};