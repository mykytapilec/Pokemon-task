import './components.css';

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'danger' | 'ghost';
  type?: 'button' | 'submit';
};

export const Button = ({
  children,
  onClick,
  disabled,
  variant = 'primary',
  type = 'button',
}: Props) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn btn--${variant}`}
    >
      {children}
    </button>
  );
};