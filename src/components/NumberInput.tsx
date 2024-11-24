import { useState } from "react";

interface NumberInputProps {
  label: string,
  id: string,
  onChange: (value: string) => void,
}

function NumberInput({ label, id, onChange }: NumberInputProps) {
  const [value, setValue] = useState("0.00");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onChange(event.target.value);
  };
  return (
    <>
      <label htmlFor={id}>{label}</label>
      <input id={id} value={value} onChange={handleChange} inputMode="decimal" />
    </>
  );
};

export default NumberInput;