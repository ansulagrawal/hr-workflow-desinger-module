import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Zap, Settings } from "lucide-react";
import { cn } from "../../utils/cn";
import useWorkflowStore from "../../stores/workflowStore";
import { automations } from "../../services/mockData";

/**
 * AutomatedNode - System action step (purple accent)
 * Has both source and target handles
 */
const AutomatedNode = ({ id, data, selected }) => {
  const selectNode = useWorkflowStore(state => state.selectNode);

  const handleClick = e => {
    e.stopPropagation();
    selectNode(id);
  };

  // Find the automation label
  const automation = automations.find(a => a.id === data?.actionId);

  return (
    <div
      onClick={handleClick}
      className={cn(
        "workflow-node min-w-[180px] max-w-[220px] rounded-lg border-2 bg-white shadow-md transition-all cursor-pointer",
        "border-purple-500",
        selected && "ring-2 ring-blue-500 ring-offset-2"
      )}>
      {/* Target Handle (Top) */}
      <Handle type='target' position={Position.Top} className='!w-3 !h-3 !border-2 !border-white !bg-purple-500' />

      {/* Node Content */}
      <div className='p-3'>
        <div className='flex items-center gap-2 mb-2'>
          <div className='p-1.5 rounded-md bg-purple-100'>
            <Zap className='w-4 h-4 text-purple-600' />
          </div>
          <p className='text-xs font-semibold uppercase tracking-wide text-purple-700'>Automated</p>
        </div>

        <p className='text-sm font-medium text-gray-900 truncate'>{data?.title || "Automated Step"}</p>

        {/* Action details */}
        <div className='mt-2 pt-2 border-t border-purple-100'>
          {automation ? (
            <div className='flex items-center gap-1.5 text-xs text-gray-600'>
              <Settings className='w-3 h-3' />
              <span className='truncate'>{automation.label}</span>
            </div>
          ) : (
            <p className='text-xs text-gray-400 italic'>No action selected</p>
          )}
          {data?.parameters && Object.keys(data.parameters).length > 0 && (
            <p className='text-xs text-gray-400 mt-1'>
              {Object.keys(data.parameters).length} parameter{Object.keys(data.parameters).length !== 1 ? "s" : ""} configured
            </p>
          )}
        </div>
      </div>

      {/* Source Handle (Bottom) */}
      <Handle type='source' position={Position.Bottom} className='!w-3 !h-3 !border-2 !border-white !bg-purple-500' />
    </div>
  );
};

export default AutomatedNode;
