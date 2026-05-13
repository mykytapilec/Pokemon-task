import './components.css';

type Props = {
  height?: number;
};

export const Skeleton = ({ height = 80 }: Props) => {
  return (
    <div
      className="skeleton"
      style={{ height }}
    />
  );
};