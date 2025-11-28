import React from 'react';

function Card({
  children,
  className = '',
  hover = false
}) {
  return <div className={`bg-white rounded-lg shadow-md p-6 transition-all duration-200 ${hover ? 'hover:shadow-lg' : ''} ${className}`}>
      {children}
    </div>;
}

export default Card