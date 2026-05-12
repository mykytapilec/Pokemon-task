export const PokemonCardSkeleton = () => {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        padding: '12px',
        borderRadius: '8px',
        animation: 'pulse 1.2s infinite',
        height: '140px',
      }}
    />
  );
};