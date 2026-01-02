import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Square, FileText } from "lucide-react";
import { cn } from "../../utils/cn";
import useWorkflowStore from "../../stores/workflowStore";

/**
 * EndNode - Workflow completion (red accent)
 * Only has target handle (no outgoing connections)
 */
const EndNode = ({ id, data, selected }) => {
  const selectNode = useWorkflowStore(state => state.selectNode);

  const handleClick = e => {
    e.stopPropagation();
    selectNode(id);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "workflow-node min-w-[160px] rounded-lg border-2 bg-white shadow-md transition-all cursor-pointer",
        "border-red-500",
        selected && "ring-2 ring-blue-500 ring-offset-2"
      )}>
      {/* Target Handle (Top) - Only incoming connections */}
      <Handle type='target' position={Position.Top} className='!w-3 !h-3 !border-2 !border-white !bg-red-500' />

      {/* Node Content */}
      <div className='p-3'>
        <div className='flex items-center gap-2'>
          <div className='p-2 rounded-full bg-red-100'>
            <Square className='w-4 h-4 text-red-600 fill-red-600' />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-xs font-semibold uppercase tracking-wide text-red-700'>End</p>
            <p className='text-sm font-medium text-gray-900 truncate'>{data?.message || "Workflow Complete"}</p>
          </div>
        </div>

        {/* Show summary indicator */}
        {data?.showSummary && (
          <div className='mt-2 pt-2 border-t border-red-100'>
            <div className='flex items-center gap-1.5 text-xs text-gray-600'>
              <FileText className='w-3 h-3' />
              <span>Show Summary</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EndNode;
