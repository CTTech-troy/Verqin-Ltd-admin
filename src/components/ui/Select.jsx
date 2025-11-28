import React from 'react';

function Select({
  value,
  onChange,
  options,
  label,
  placeholder
}) {
  return <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>}
      <select value={value} onChange={e => onChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent">
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(option => <option key={option.value} value={option.value}>
            {option.label}
          </option>)}
      </select>
    </div>;
}

export default Select