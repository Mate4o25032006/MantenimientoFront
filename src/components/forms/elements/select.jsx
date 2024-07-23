import React, { useContext, useEffect, useState } from 'react';
import { MantenContext } from "../../../Context/";

export const Select = ({ label, name, options, value, onChange, style }) => {
  const { inputs, setInputs } = useContext(MantenContext);
  const [selectedValue, setSelectedValue] = useState(value || '');

  useEffect(() => {
    setSelectedValue(value || '');
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: newValue,
    }));
    setSelectedValue(newValue);
    if (onChange) onChange(e); 
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-neutral-500 mb-2">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="px-4 py-2 bg-white placeholder:text-neutral-400/60
        border border-neutral-300/75 focus:border-[#1565c0] focus:ring-[#1565c0]
        focus:ring-1 focus:outline-none rounded-lg w-full"
        value={selectedValue}
        onChange={handleChange}
        required
        style={style}
      >
        <option value='' disabled>Seleccione una opción</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
