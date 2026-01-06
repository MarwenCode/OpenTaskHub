import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, type = 'button', disabled = false }) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={{
                padding: '10px 20px',
                margin: '4px 0',
                border: 'none',
                borderRadius: '4px',
                // La couleur a été modifiée ici pour correspondre à l'image
                backgroundColor: disabled ? '#ccc' : '#0096ff',
                color: 'white',
                cursor: disabled ? 'not-allowed' : 'pointer',
                width: '100%',
                boxSizing: 'border-box'
            }}
        >
            {children}
        </button>
    );
};

export default Button;