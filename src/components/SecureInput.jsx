import { useState, useEffect } from "react";
import { sanitizeInput } from "../utils/security";

export default function SecureInput({
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  className = "",
  required = false,
  disabled = false,
  maxLength,
  minLength,
  pattern,
  ...props
}) {
  const [displayValue, setDisplayValue] = useState(value || "");
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setDisplayValue(value || "");
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setDisplayValue(newValue);

    // Validate input
    let valid = true;
    
    if (required && !newValue.trim()) {
      valid = false;
    }
    
    if (minLength && newValue.length < minLength) {
      valid = false;
    }
    
    if (maxLength && newValue.length > maxLength) {
      valid = false;
    }
    
    if (pattern && newValue && !new RegExp(pattern).test(newValue)) {
      valid = false;
    }

    setIsValid(valid);

    // Call parent onChange with sanitized value
    if (onChange) {
      const sanitizedValue = sanitizeInput(newValue);
      onChange({
        ...e,
        target: {
          ...e.target,
          value: sanitizedValue,
        },
      });
    }
  };

  const handleBlur = (e) => {
    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <input
      type={type}
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      maxLength={maxLength}
      minLength={minLength}
      pattern={pattern}
      className={`${className} ${!isValid ? 'border-red-500 focus:ring-red-500' : ''}`}
      {...props}
    />
  );
}
