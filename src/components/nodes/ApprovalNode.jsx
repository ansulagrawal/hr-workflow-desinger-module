import React from "react";
import { Handle, Position } from "@xyflow/react";
import { CheckCircle2, UserCheck, Clock } from "lucide-react";
import { cn } from "../../utils/cn";
import useWorkflowStore from "../../stores/workflowStore";

/**
 * ApprovalNode - Approval step (orange accent)
 * Has both source and target handles
 */
const ApprovalNode = ({ id, data, selected }) => {
  const selectNode = useWorkflowStore(state => state.selectNode);

  const handleClick = e => {
    e.stopPropagation();
    selectNode(id);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "workflow-node min-w-[180px] max-w-[220px] rounded-lg border-2 bg-white shadow-md transition-all cursor-pointer",
        "border-orange-500",
        selected && "ring-2 ring-blue-500 ring-offset-2"
      )}>
      {/* Target Handle (Top) */}
      <Handle type='target' position={Position.Top} className='!w-3 !h-3 !border-2 !border-white !bg-orange-500' />

      {/* Node Content */}
      <div className='p-3'>
        <div className='flex items-center gap-2 mb-2'>
          <div className='p-1.5 rounded-md bg-orange-100'>
            <CheckCircle2 className='w-4 h-4 text-orange-600' />
          </div>
          <p className='text-xs font-semibold uppercase tracking-wide text-orange-700'>Approval</p>
        </div>

        <p className='text-sm font-medium text-gray-900 truncate'>{data?.title || "Approval Step"}</p>

        {/* Approval details */}
        <div className='mt-2 pt-2 border-t border-orange-100 space-y-1'>
          {data?.approverRole && (
            <div className='flex items-center gap-1.5 text-xs text-gray-600'>
              <UserCheck className='w-3 h-3' />
              <span>{data.approverRole}</span>
            </div>
          )}
          {data?.autoApproveThreshold > 0 && (
            <div className='flex items-center gap-1.5 text-xs text-gray-600'>
              <Clock className='w-3 h-3' />
              <span>Auto-approve: {data.autoApproveThreshold} days</span>
            </div>
          )}
        </div>
      </div>

      {/* Source Handle (Bottom) */}
      <Handle type='source' position={Position.Bottom} className='!w-3 !h-3 !border-2 !border-white !bg-orange-500' />
    </div>
  );
};

export default ApprovalNode;
