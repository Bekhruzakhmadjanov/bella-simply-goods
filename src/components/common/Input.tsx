import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div className="mb-4">
    {label && (
      <label className="block text-sm font-medium text-gray-900 mb-2">
        {label} {props.required && <span className="text-pink-500">*</span>}
      </label>
    )}
    <input
      className={`w-full border border-gray-200 rounded-lg px-3 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all ${
        error ? 'border-pink-500 ring-2 ring-pink-500' : 'hover:border-gray-300'
      } ${className}`}
      {...props}
    />
    {error && <p className="mt-1 text-sm text-pink-600">{error}</p>}
  </div>
);

export { Input };
export default Input;