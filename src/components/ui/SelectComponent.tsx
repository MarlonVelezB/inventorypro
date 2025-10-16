import { Select } from "antd";
import { useMemo } from "react";

interface SelectComponentProps {
  keyName?: string;
  errors?: any;
  placeholder?: string;
  label?: string;
  className?: string;
  defaultValue?: any;
  options: any[];
  size?: number;
  required: boolean;
  onChange?: (value?: any) => void;
}

const SelectComponent: React.FC<SelectComponentProps> = ({
  keyName,
  errors,
  placeholder,
  label,
  options,
  size,
  required,
  ...props
}) => {
  const hasError = useMemo(
    () => keyName !== undefined && !!errors?.[keyName],
    [errors, keyName]
  );
  const errorMessage = useMemo(
    () => (keyName !== undefined ? errors?.[keyName]?.message : undefined),
    [errors, keyName]
  );

  return (
    <>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Select
        defaultValue={props.defaultValue}
        {...props}
        style={{ width: size }}
        allowClear
        options={options}
        placeholder={placeholder}
      />
      {hasError && (
        <small className="mt-1 text-sm text-red-500 block">
          {errorMessage}
        </small>
      )}
    </>
  );
};

export default SelectComponent;
