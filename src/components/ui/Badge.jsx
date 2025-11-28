import React from 'react';

function Badge({
  children,
  variant = 'default',
  className = ''
}) {
  const variants = {
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-sky-100 text-sky-800',
    default: 'bg-gray-100 text-gray-800'
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>;
}
export default Badge