import React, { useMemo, useState } from 'react';
import Icon from '../AppIcon';

type InputType = 'text' | 'password' | 'textarea' | 'number' | 'email' | 'tel';

interface InputFormProps {
  errors?: any;
  type: InputType;
  keyName: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

const baseInputStyles = `w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition`;
const errorStyles = `border-red-500`;
const normalStyles = `border-slate-300`;

const InputForm: React.FC<InputFormProps & React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>> = ({
  errors,
  type,
  keyName,
  placeholder,
  label,
  required,
  disabled,
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const hasError = useMemo(() => !!errors[keyName], [errors, keyName]);
  const errorMessage = useMemo(() => errors[keyName]?.message, [errors, keyName]);

  const inputClassName = `${baseInputStyles} ${hasError ? errorStyles : normalStyles} ${className || ''}`;

  const renderInput = () => {
    if (type === 'textarea') {
      return (
        <textarea
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          placeholder={placeholder}
          rows={(props as any).rows || 4}
          disabled={disabled}
          className={inputClassName}
        />
      );
    }

    if (type === 'password') {
      return (
        <div className="relative">
          <input
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            disabled={disabled}
            className={inputClassName}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition disabled:opacity-50"
          >
            <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={16}/>
          </button>
        </div>
      );
    }

    return (
      <input
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClassName}
      />
    );
  };

  return (
    <>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {renderInput()}
      {hasError && (
        <small className="mt-1 text-sm text-red-500 block">
          {errorMessage}
        </small>
      )}
    </>
  );
};

export default InputForm;