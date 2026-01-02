import { useCallback } from "react";
import useWorkflowStore from "../stores/workflowStore";

/**
 * useNodeForm - Custom hook for node form handling
 */
export function useNodeForm(nodeId) {
  const { nodes, updateNodeData, deleteNode } = useWorkflowStore();

  const node = nodes.find(n => n.id === nodeId);
  const data = node?.data || {};

  const updateField = useCallback(
    (field, value) => {
      if (!nodeId) return;
      updateNodeData(nodeId, { [field]: value });
    },
    [nodeId, updateNodeData]
  );

  const updateData = useCallback(
    newData => {
      if (!nodeId) return;
      updateNodeData(nodeId, newData);
    },
    [nodeId, updateNodeData]
  );

  const remove = useCallback(() => {
    if (!nodeId) return;
    deleteNode(nodeId);
  }, [nodeId, deleteNode]);

  return {
    node,
    data,
    updateField,
    updateData,
    remove,
    nodeType: node?.type,
    isSelected: !!node,
  };
}

export default useNodeForm;
