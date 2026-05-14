import React from 'react';
import clsx from 'clsx';

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  const baseClasses = 'font-medium rounded-lg transition-all inline-flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-700',
    secondary: 'bg-secondary text-white hover:bg-purple-700',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    danger: 'bg-red-500 text-white hover:bg-red-700',
    ghost: 'hover:bg-gray-100',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={clsx(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card = ({ children, className, ...props }) => (
  <div
    className={clsx(
      'bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const Input = ({ label, error, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium mb-2">{label}</label>}
    <input
      className={clsx(
        'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
        error ? 'border-red-500' : 'border-gray-300'
      )}
      {...props}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export const Textarea = ({ label, error, ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium mb-2">{label}</label>}
    <textarea
      className={clsx(
        'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all',
        error ? 'border-red-500' : 'border-gray-300'
      )}
      {...props}
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export const Badge = ({ children, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    danger: 'bg-red-500 text-white',
  };

  return (
    <span className={clsx('px-2 py-1 text-xs font-medium rounded-full', variants[variant])}>
      {children}
    </span>
  );
};

export const Loading = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin">
      <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
    </div>
  </div>
);

export const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="flex flex-col items-center justify-center py-12">
    {Icon && <Icon className="w-12 h-12 text-gray-400 mb-4" />}
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{message}</p>
  </div>
);

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        {children}
      </Card>
    </div>
  );
};
