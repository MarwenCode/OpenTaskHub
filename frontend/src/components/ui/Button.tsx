import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    className?: string; 
}


const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className,
  disabled,
  type,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className} // <--- AJOUTE CETTE LIGNE ICI
      style={{
        padding: "10px 20px",
        margin: "4px 0",
        border: "none",
        borderRadius: "4px",
        backgroundColor: disabled ? "#ccc" : "#0096ff",
        color: "white",
        cursor: disabled ? "not-allowed" : "pointer",
        width: "100%",
        boxSizing: "border-box",
      }}>
      {children}
    </button>
  );
};

export default Button;