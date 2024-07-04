import { useContext, useEffect, useState } from "react";
import { MantenContext } from "../../../Context/";

export const Select = ({ label, name, options, onChange }) => {
    const { inputs, setInputs } = useContext(MantenContext);
    const [value, setValue] = useState(inputs[name] || '');

    useEffect(() => {
        setValue(inputs[name] || '');
    }, [inputs, name]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: newValue,
        }));
        setValue(newValue);
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
                value={value}
                onChange={handleChange}
                required
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
