import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({ label, error, options, className = '', ...props }) => (
  <div className="mb-6">
    {label && (
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label} {props.required && <span className="text-red-500">*</span>}
      </label>
    )}
    <select
      className={`w-full border-2 border-yellow-700 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-amber-800 transition-all duration-300 bg-white shadow-sm ${
        error ? 'border-red-400' : 'hover:border-amber-700'
      } ${className}`}
      {...props}
    >
      <option value="">Select {label}</option>
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
  </div>
);

export { Select };