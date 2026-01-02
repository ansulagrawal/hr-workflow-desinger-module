import React from "react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "../../utils/cn";
import { NODE_CONFIGS } from "../../constants/nodeTypes";
import useWorkflowStore from "../../stores/workflowStore";

/**
 * BaseNode - Reusable base component for all custom nodes
 */
const BaseNode = ({ id, data, type, selected, icon: Icon, showSourceHandle = true, showTargetHandle = true }) => {
  const config = NODE_CONFIGS[type];
  const selectNode = useWorkflowStore(state => state.selectNode);

  if (!config) {
    console.error(`Unknown node type: ${type}`);
    return null;
  }

  const handleClick = e => {
    e.stopPropagation();
    selectNode(id);
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "workflow-node min-w-[180px] rounded-lg border-2 bg-white shadow-md transition-all cursor-pointer",
        config.borderColor,
        selected && "ring-2 ring-blue-500 ring-offset-2"
      )}>
      {/* Target Handle (Top) */}
      {showTargetHandle && <Handle type='target' position={Position.Top} className={cn("!w-3 !h-3 !border-2 !border-white", `!bg-${config.color}-500`)} />}

      {/* Node Content */}
      <div className='p-3'>
        {/* Header */}
        <div className='flex items-center gap-2 mb-1'>
          <div className={cn("p-1.5 rounded-md", config.iconBg)}>{Icon && <Icon className={cn("w-4 h-4", config.textColor)} />}</div>
          <div className='flex-1 min-w-0'>
            <p className={cn("text-xs font-semibold uppercase tracking-wide", config.textColor)}>{config.label}</p>
          </div>
        </div>

        {/* Title */}
        <p className='text-sm font-medium text-gray-900 truncate mt-1'>{data?.title || config.defaultData.title}</p>

        {/* Optional subtitle/description */}
        {data?.description && <p className='text-xs text-gray-500 truncate mt-0.5'>{data.description}</p>}
      </div>

      {/* Source Handle (Bottom) */}
      {showSourceHandle && <Handle type='source' position={Position.Bottom} className={cn("!w-3 !h-3 !border-2 !border-white", `!bg-${config.color}-500`)} />}
    </div>
  );
};

export default BaseNode;
