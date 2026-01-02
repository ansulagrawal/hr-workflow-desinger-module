import { Handle, Position } from "@xyflow/react";
import { Play } from "lucide-react";
import { NODE_CONFIGS, NODE_TYPES } from "../../constants/nodeTypes";
import useWorkflowStore from "../../stores/workflowStore";
import { cn } from "../../utils/cn";

/**
 * StartNode - Workflow entry point (green accent)
 * Only has source handle (no incoming connections)
 */
const StartNode = ({ id, data, selected }) => {
  const config = NODE_CONFIGS[NODE_TYPES.START];
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
        "border-emerald-500",
        selected && "ring-2 ring-blue-500 ring-offset-2"
      )}>
      {/* Node Content */}
      <div className='p-3'>
        <div className='flex items-center gap-2'>
          <div className='p-2 rounded-full bg-emerald-100'>
            <Play className='w-4 h-4 text-emerald-600 fill-emerald-600' />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-xs font-semibold uppercase tracking-wide text-emerald-700'>Start</p>
            <p className='text-sm font-medium text-gray-900 truncate'>{data?.title || "Start"}</p>
          </div>
        </div>

        {/* Metadata preview */}
        {data?.metadata && data.metadata.length > 0 && (
          <div className='mt-2 pt-2 border-t border-emerald-100'>
            <p className='text-xs text-gray-500'>
              {data.metadata.length} metadata field{data.metadata.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {/* Source Handle (Bottom) - Only outgoing connections */}
      <Handle type='source' position={Position.Bottom} className='!w-3 !h-3 !border-2 !border-white !bg-emerald-500' />
    </div>
  );
};

export default StartNode;
