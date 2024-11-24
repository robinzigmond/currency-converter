import { useState } from "react";
import type { OptionProps } from "./SelectOption";

interface SelectProps {
  children: React.ReactElement<OptionProps>[] | React.ReactElement<OptionProps>,
  label: string,
  id: string,
  onChange: (value: string) => void,
}

function Select({ children, label, id, onChange }: SelectProps) {
  const [selectedValue, setSelectedValue] = useState<string>();
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
    onChange(event.target.value);
  };
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <select id={id} value={selectedValue} onChange={handleChange}>
        {children}
      </select>
    </>
  );
};

export default Select;