import { cn } from "../../../utils/cn";

/**
 * FormField - Wrapper component for form fields with consistent styling
 */
const FormField = ({ label, required, error, helperText, children, className }) => {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <label className='block text-sm font-medium text-gray-700'>
          {label}
          {required && <span className='text-red-500 ml-1'>*</span>}
        </label>
      )}
      {children}
      {(error || helperText) && <p className={cn("text-xs", error ? "text-red-600" : "text-gray-500")}>{error || helperText}</p>}
    </div>
  );
};

export default FormField;
