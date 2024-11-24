export interface OptionProps {
  value: string,
  text: string,
}

function Option({ value, text }: OptionProps) {
  return <option value={value}>{text}</option>
};

export default Option;
