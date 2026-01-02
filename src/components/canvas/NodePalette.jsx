import React from "react";
import { Play, ClipboardList, CheckCircle2, Zap, Square, GripVertical } from "lucide-react";
import { cn } from "../../utils/cn";
import { NODE_TYPES, NODE_CONFIGS } from "../../constants/nodeTypes";
import useWorkflowStore from "../../stores/workflowStore";

const nodeIcons = {
  [NODE_TYPES.START]: Play,
  [NODE_TYPES.TASK]: ClipboardList,
  [NODE_TYPES.APPROVAL]: CheckCircle2,
  [NODE_TYPES.AUTOMATED]: Zap,
  [NODE_TYPES.END]: Square,
};

/**
 * NodePalette - Left sidebar with draggable node types
 */
const NodePalette = ({ isOpen }) => {
  const hasStartNode = useWorkflowStore(state => state.hasStartNode());

  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  if (!isOpen) {
    return null;
  }

  const nodeTypes = Object.values(NODE_TYPES);

  return (
    <div className='w-64 bg-white border-r border-gray-200 flex flex-col h-full'>
      {/* Header */}
      <div className='p-4 border-b border-gray-200'>
        <h2 className='font-semibold text-gray-900'>Node Palette</h2>
        <p className='text-xs text-gray-500 mt-1'>Drag nodes onto the canvas to build your workflow</p>
      </div>

      {/* Node List */}
      <div className='flex-1 overflow-y-auto p-4'>
        <div className='space-y-2'>
          {nodeTypes.map(type => {
            const config = NODE_CONFIGS[type];
            const Icon = nodeIcons[type];
            const isDisabled = type === NODE_TYPES.START && hasStartNode;

            return (
              <div
                key={type}
                draggable={!isDisabled}
                onDragStart={e => handleDragStart(e, type)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-grab active:cursor-grabbing",
                  config.bgColor,
                  config.borderColor,
                  isDisabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-md hover:scale-[1.02]"
                )}
                title={isDisabled ? "Only one Start node is allowed" : config.description}>
                <GripVertical className='w-4 h-4 text-gray-400' />
                <div className={cn("p-2 rounded-md", config.iconBg)}>
                  <Icon className={cn("w-4 h-4", config.textColor)} />
                </div>
                <div className='flex-1 min-w-0'>
                  <p className={cn("font-medium text-sm", config.textColor)}>{config.label}</p>
                  <p className='text-xs text-gray-500 truncate'>{config.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Help Section */}
      <div className='p-4 border-t border-gray-200 bg-gray-50'>
        <h3 className='text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2'>Quick Tips</h3>
        <ul className='text-xs text-gray-500 space-y-1'>
          <li>• Drag nodes to the canvas</li>
          <li>• Connect nodes by dragging handles</li>
          <li>• Click a node to configure it</li>
          <li>• Press Delete to remove selected</li>
        </ul>
      </div>
    </div>
  );
};

export default NodePalette;
