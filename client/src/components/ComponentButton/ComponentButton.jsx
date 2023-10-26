import React from 'react'

const ComponentButton = ({ 
    type, 
    textButton, 
    className,
    onClick
}) => {
    return (
        <button 
            className={`button__component ${className}`} 
            type={type}
            onClick={onClick}
            >
            {textButton}
        </button>
    )
}

export default ComponentButton