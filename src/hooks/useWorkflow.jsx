import { useCallback } from "react";
import useWorkflowStore from "../stores/workflowStore";
import { validateWorkflow } from "../utils/validation";
import { serializeWorkflow, deserializeWorkflow, downloadWorkflowAsJson } from "../utils/serialization.js";

/**
 * useWorkflow - Custom hook for workflow operations
 */
export function useWorkflow() {
  const { nodes, edges, addNode, updateNode, updateNodeData, deleteNode, addEdge, deleteEdge, clearWorkflow, loadWorkflow, undo, redo, canUndo, canRedo } = useWorkflowStore();

  // Validate the current workflow
  const validate = useCallback(() => {
    return validateWorkflow(nodes, edges);
  }, [nodes, edges]);

  // Serialize workflow to JSON
  const serialize = useCallback(
    (metadata = {}) => {
      return serializeWorkflow(nodes, edges, metadata);
    },
    [nodes, edges]
  );

  // Export workflow as JSON file
  const exportWorkflow = useCallback(
    filename => {
      downloadWorkflowAsJson(nodes, edges, filename);
    },
    [nodes, edges]
  );

  // Import workflow from JSON
  const importWorkflow = useCallback(
    json => {
      try {
        const workflow = deserializeWorkflow(json);
        loadWorkflow(workflow);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },
    [loadWorkflow]
  );

  // Check if workflow is empty
  const isEmpty = nodes.length === 0;

  // Check if workflow is valid
  const isValid = useCallback(() => {
    const result = validateWorkflow(nodes, edges);
    return result.isValid;
  }, [nodes, edges]);

  return {
    // State
    nodes,
    edges,
    isEmpty,

    // Node operations
    addNode,
    updateNode,
    updateNodeData,
    deleteNode,

    // Edge operations
    addEdge,
    deleteEdge,

    // Workflow operations
    clearWorkflow,
    loadWorkflow,
    importWorkflow,
    exportWorkflow,

    // Validation
    validate,
    isValid,
    serialize,

    // History
    undo,
    redo,
    canUndo: canUndo(),
    canRedo: canRedo(),
  };
}

export default useWorkflow;
