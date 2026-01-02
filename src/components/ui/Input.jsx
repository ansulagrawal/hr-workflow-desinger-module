import React from "react";
import { cn } from "../../utils/cn.js";

const Input = React.forwardRef(({ className, type = "text", label, error, helperText, ...props }, ref) => {
  const id = props.id || props.name || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className='w-full'>
      {label && (
        <label htmlFor={id} className='block text-sm font-medium text-gray-700 mb-1'>
          {label}
          {props.required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      <input
        ref={ref}
        type={type}
        id={id}
        className={cn(
          "w-full px-3 py-2 border rounded-lg shadow-sm transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "placeholder:text-gray-400",
          "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
          error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300",
          className
        )}
        {...props}
      />
      {(error || helperText) && <p className={cn("mt-1 text-sm", error ? "text-red-600" : "text-gray-500")}>{error || helperText}</p>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
