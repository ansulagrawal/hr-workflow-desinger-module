import React from "react";
import { X, Trash2, Play, ClipboardList, CheckCircle2, Zap, Square } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../ui";
import { NODE_TYPES, NODE_CONFIGS } from "../../constants/nodeTypes";
import useWorkflowStore from "../../stores/workflowStore";

import StartNodeForm from "./StartNodeForm";
import TaskNodeForm from "./TaskNodeForm";
import ApprovalNodeForm from "./ApprovalNodeForm";
import AutomatedNodeForm from "./AutomatedNodeForm";
import EndNodeForm from "./EndNodeForm";

const nodeIcons = {
  [NODE_TYPES.START]: Play,
  [NODE_TYPES.TASK]: ClipboardList,
  [NODE_TYPES.APPROVAL]: CheckCircle2,
  [NODE_TYPES.AUTOMATED]: Zap,
  [NODE_TYPES.END]: Square,
};

/**
 * NodeFormPanel - Right sidebar panel for editing selected node configuration
 */
const NodeFormPanel = ({ isOpen }) => {
  const { nodes, selectedNodeId, updateNodeData, deleteNode, clearSelection } = useWorkflowStore();

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const config = selectedNode ? NODE_CONFIGS[selectedNode.type] : null;
  const Icon = selectedNode ? nodeIcons[selectedNode.type] : null;

  if (!isOpen || !selectedNode) {
    return null;
  }

  const handleDataChange = newData => {
    updateNodeData(selectedNodeId, newData);
  };

  const handleDelete = () => {
    deleteNode(selectedNodeId);
  };

  const renderForm = () => {
    switch (selectedNode.type) {
      case NODE_TYPES.START:
        return <StartNodeForm data={selectedNode.data} onChange={handleDataChange} />;
      case NODE_TYPES.TASK:
        return <TaskNodeForm data={selectedNode.data} onChange={handleDataChange} />;
      case NODE_TYPES.APPROVAL:
        return <ApprovalNodeForm data={selectedNode.data} onChange={handleDataChange} />;
      case NODE_TYPES.AUTOMATED:
        return <AutomatedNodeForm data={selectedNode.data} onChange={handleDataChange} />;
      case NODE_TYPES.END:
        return <EndNodeForm data={selectedNode.data} onChange={handleDataChange} />;
      default:
        return <p className='text-gray-500'>Unknown node type</p>;
    }
  };

  return (
    <div className='w-80 bg-white border-l border-gray-200 flex flex-col h-full animate-slide-in-right'>
      {/* Header */}
      <div className='p-4 border-b border-gray-200'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            {Icon && config && (
              <div className={cn("p-1.5 rounded-md", config.iconBg)}>
                <Icon className={cn("w-4 h-4", config.textColor)} />
              </div>
            )}
            <div>
              <h3 className='font-semibold text-gray-900'>{config?.label || "Node"} Configuration</h3>
              <p className='text-xs text-gray-500 truncate max-w-[180px]'>ID: {selectedNode.id}</p>
            </div>
          </div>
          <Button variant='ghost' size='icon' onClick={clearSelection} className='text-gray-400 hover:text-gray-600'>
            <X className='w-5 h-5' />
          </Button>
        </div>
      </div>

      {/* Form Content */}
      <div className='flex-1 overflow-y-auto p-4'>{renderForm()}</div>

      {/* Footer */}
      <div className='p-4 border-t border-gray-200'>
        <Button variant='danger' className='w-full' onClick={handleDelete}>
          <Trash2 className='w-4 h-4 mr-2' />
          Delete Node
        </Button>
      </div>
    </div>
  );
};

export default NodeFormPanel;
