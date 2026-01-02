import React from "react";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * ValidationErrors - Displays workflow validation errors and warnings
 */
const ValidationErrors = ({ errors = [], warnings = [] }) => {
  if (errors.length === 0 && warnings.length === 0) {
    return (
      <div className='flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200'>
        <div className='w-2 h-2 rounded-full bg-green-500' />
        <span className='text-sm font-medium'>Workflow is valid and ready for testing</span>
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      {/* Errors */}
      {errors.map((error, index) => (
        <div key={`error-${index}`} className='flex items-start gap-2 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200'>
          <AlertCircle className='w-4 h-4 mt-0.5 shrink-0' />
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium'>{error.message}</p>
            {error.nodeId && <p className='text-xs text-red-500 mt-0.5'>Node ID: {error.nodeId}</p>}
            {error.nodeIds && error.nodeIds.length > 0 && <p className='text-xs text-red-500 mt-0.5'>Affected nodes: {error.nodeIds.join(", ")}</p>}
          </div>
        </div>
      ))}

      {/* Warnings */}
      {warnings.map((warning, index) => (
        <div key={`warning-${index}`} className='flex items-start gap-2 p-3 bg-yellow-50 text-yellow-700 rounded-lg border border-yellow-200'>
          <AlertTriangle className='w-4 h-4 mt-0.5 shrink-0' />
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium'>{warning.message}</p>
            {warning.nodeId && <p className='text-xs text-yellow-600 mt-0.5'>Node ID: {warning.nodeId}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ValidationErrors;
