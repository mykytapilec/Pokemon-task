import './components.css';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

export const Card = ({ children, className = '', onClick }: Props) => {
  return (
    <div
      className={`card ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};