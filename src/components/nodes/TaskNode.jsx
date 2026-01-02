import { Handle, Position } from "@xyflow/react";
import { Calendar, ClipboardList, User } from "lucide-react";
import useWorkflowStore from "../../stores/workflowStore";
import { cn } from "../../utils/cn";

/**
 * TaskNode - Human task step (blue accent)
 * Has both source and target handles
 */
const TaskNode = ({ id, data, selected }) => {
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
        "border-blue-500",
        selected && "ring-2 ring-blue-500 ring-offset-2"
      )}>
      {/* Target Handle (Top) */}
      <Handle type='target' position={Position.Top} className='!w-3 !h-3 !border-2 !border-white !bg-blue-500' />

      {/* Node Content */}
      <div className='p-3'>
        <div className='flex items-center gap-2 mb-2'>
          <div className='p-1.5 rounded-md bg-blue-100'>
            <ClipboardList className='w-4 h-4 text-blue-600' />
          </div>
          <p className='text-xs font-semibold uppercase tracking-wide text-blue-700'>Task</p>
        </div>

        <p className='text-sm font-medium text-gray-900 truncate'>{data?.title || "New Task"}</p>

        {data?.description && <p className='text-xs text-gray-500 truncate mt-0.5'>{data.description}</p>}

        {/* Task details */}
        <div className='mt-2 pt-2 border-t border-blue-100 space-y-1'>
          {data?.assignee && (
            <div className='flex items-center gap-1.5 text-xs text-gray-600'>
              <User className='w-3 h-3' />
              <span className='truncate'>{data.assignee}</span>
            </div>
          )}
          {data?.dueDate && (
            <div className='flex items-center gap-1.5 text-xs text-gray-600'>
              <Calendar className='w-3 h-3' />
              <span>{data.dueDate}</span>
            </div>
          )}
          {data?.customFields && data.customFields.length > 0 && (
            <p className='text-xs text-gray-400'>
              +{data.customFields.length} custom field{data.customFields.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>

      {/* Source Handle (Bottom) */}
      <Handle type='source' position={Position.Bottom} className='!w-3 !h-3 !border-2 !border-white !bg-blue-500' />
    </div>
  );
};

export default TaskNode;
