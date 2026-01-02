import React from "react";
import { cn } from "../../utils/cn.js";
import { ChevronDown } from "lucide-react";

const Select = React.forwardRef(({ className, label, error, helperText, options = [], placeholder, ...props }, ref) => {
  const id = props.id || props.name || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className='w-full'>
      {label && (
        <label htmlFor={id} className='block text-sm font-medium text-gray-700 mb-1'>
          {label}
          {props.required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      <div className='relative'>
        <select
          ref={ref}
          id={id}
          className={cn(
            "w-full px-3 py-2 border rounded-lg shadow-sm appearance-none transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
            "bg-white",
            error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300",
            className
          )}
          {...props}>
          {placeholder && (
            <option value='' disabled>
              {placeholder}
            </option>
          )}
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none' />
      </div>
      {(error || helperText) && <p className={cn("mt-1 text-sm", error ? "text-red-600" : "text-gray-500")}>{error || helperText}</p>}
    </div>
  );
});

Select.displayName = "Select";

export default Select;
