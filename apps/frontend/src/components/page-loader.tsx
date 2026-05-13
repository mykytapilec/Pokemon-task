import './components.css';
import { Skeleton } from './skeleton';

type Props = {
  lines?: number;
  height?: number;
};

export const PageLoader = ({
  lines = 3,
  height = 24,
}: Props) => {
  return (
    <div className="page-loader">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={height} />
      ))}
    </div>
  );
};