import React from "react";
import { CheckCircle2, XCircle, Loader2, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../../utils/cn";
import { NODE_CONFIGS } from "../../constants/nodeTypes";

/**
 * ExecutionTimeline - Displays step-by-step execution results
 */
const ExecutionTimeline = ({ steps = [], isSimulating }) => {
  const [expandedStep, setExpandedStep] = React.useState(null);

  if (steps.length === 0 && !isSimulating) {
    return (
      <div className='text-center py-8 text-gray-500'>
        <Clock className='w-8 h-8 mx-auto mb-2 text-gray-300' />
        <p className='text-sm'>No execution data yet</p>
        <p className='text-xs mt-1'>Run a simulation to see the timeline</p>
      </div>
    );
  }

  const toggleExpand = stepId => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  return (
    <div className='relative'>
      {/* Timeline line */}
      <div className='absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200' />

      {/* Steps */}
      <div className='space-y-4'>
        {steps.map((step, index) => {
          const config = NODE_CONFIGS[step.nodeType];
          const isExpanded = expandedStep === step.nodeId;

          return (
            <div key={step.nodeId} className='relative pl-10'>
              {/* Status indicator */}
              <div
                className={cn(
                  "absolute left-2 top-1 w-5 h-5 rounded-full flex items-center justify-center",
                  step.status === "completed" && "bg-green-500",
                  step.status === "running" && "bg-blue-500",
                  step.status === "error" && "bg-red-500",
                  step.status === "pending" && "bg-gray-300"
                )}>
                {step.status === "completed" && <CheckCircle2 className='w-3 h-3 text-white' />}
                {step.status === "running" && <Loader2 className='w-3 h-3 text-white animate-spin' />}
                {step.status === "error" && <XCircle className='w-3 h-3 text-white' />}
              </div>

              {/* Step card */}
              <div
                className={cn(
                  "bg-white border rounded-lg overflow-hidden transition-all",
                  step.status === "running" && "border-blue-300 shadow-sm",
                  step.status === "completed" && "border-green-200",
                  step.status === "error" && "border-red-200"
                )}>
                {/* Header */}
                <button onClick={() => toggleExpand(step.nodeId)} className='w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors'>
                  <div className='flex items-center gap-2 min-w-0'>
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded", config?.bgColor, config?.textColor)}>{config?.label || step.nodeType}</span>
                    <span className='text-sm font-medium text-gray-900 truncate'>{step.title}</span>
                  </div>
                  <div className='flex items-center gap-2 shrink-0'>
                    {step.duration && <span className='text-xs text-gray-500'>{step.duration}ms</span>}
                    {isExpanded ? <ChevronUp className='w-4 h-4 text-gray-400' /> : <ChevronDown className='w-4 h-4 text-gray-400' />}
                  </div>
                </button>
                {/* Expanded content */}
                {isExpanded && (
                  <div className='px-3 pb-3 border-t border-gray-100'>
                    <div className='mt-2 space-y-2'>
                      {/* Timestamps */}
                      <div className='text-xs text-gray-500'>
                        <p>Started: {new Date(step.startedAt).toLocaleTimeString()}</p>
                        {step.completedAt && <p>Completed: {new Date(step.completedAt).toLocaleTimeString()}</p>}
                      </div>

                      {/* Output */}
                      {step.output && (
                        <div className='mt-2'>
                          <p className='text-xs font-medium text-gray-600 mb-1'>Output:</p>
                          <pre className='text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32'>{JSON.stringify(step.output, null, 2)}</pre>
                        </div>
                      )}

                      {/* Error */}
                      {step.error && (
                        <div className='mt-2 p-2 bg-red-50 rounded'>
                          <p className='text-xs font-medium text-red-700'>Error:</p>
                          <p className='text-xs text-red-600 mt-1'>{step.error}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading indicator for next step */}
        {isSimulating && (
          <div className='relative pl-10'>
            <div className='absolute left-2 top-1 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center'>
              <Loader2 className='w-3 h-3 text-gray-400 animate-spin' />
            </div>
            <div className='bg-white border border-dashed border-gray-300 rounded-lg p-3'>
              <p className='text-sm text-gray-400'>Waiting for next step...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionTimeline;
