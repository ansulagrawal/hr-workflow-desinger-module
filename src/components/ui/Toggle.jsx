import React from "react";
import { cn } from "../../utils/cn.js";

const Toggle = React.forwardRef(({ className, label, checked, onChange, disabled, ...props }, ref) => {
  const id = props.id || props.name || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        ref={ref}
        type='button'
        role='switch'
        aria-checked={checked}
        id={id}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          checked ? "bg-blue-600" : "bg-gray-200"
        )}
        {...props}>
        <span className={cn("inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm", checked ? "translate-x-6" : "translate-x-1")} />
      </button>
      {label && (
        <label htmlFor={id} className='text-sm font-medium text-gray-700 cursor-pointer'>
          {label}
        </label>
      )}
    </div>
  );
});

Toggle.displayName = "Toggle";

export default Toggle;
