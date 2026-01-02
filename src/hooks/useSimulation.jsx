import { useCallback } from "react";
import useWorkflowStore from "../stores/workflowStore";
import useUIStore from "../stores/uiStore";
import { validateWorkflow } from "../utils/validation";
import { simulateWorkflow } from "../services/api";

/**
 * useSimulation - Custom hook for workflow simulation
 */
export function useSimulation() {
  const { nodes, edges } = useWorkflowStore();
  const { isSimulating, simulationResults, simulationSteps, startSimulation, updateSimulationStep, completeSimulation, clearSimulation, setValidationResults } = useUIStore();

  const validate = useCallback(() => {
    const result = validateWorkflow(nodes, edges);
    setValidationResults(result.errors, result.warnings);
    return result;
  }, [nodes, edges, setValidationResults]);

  const run = useCallback(async () => {
    // Validate first
    const validation = validate();
    if (!validation.isValid) {
      return {
        success: false,
        error: "Workflow validation failed",
        validation,
      };
    }

    // Start simulation
    startSimulation();

    try {
      const workflow = { nodes, edges };
      const results = await simulateWorkflow(workflow, step => {
        updateSimulationStep(step);
      });
      completeSimulation(results);
      return results;
    } catch (error) {
      const errorResult = {
        success: false,
        error: error.message,
      };
      completeSimulation(errorResult);
      return errorResult;
    }
  }, [nodes, edges, validate, startSimulation, updateSimulationStep, completeSimulation]);

  const reset = useCallback(() => {
    clearSimulation();
  }, [clearSimulation]);

  return {
    // State
    isSimulating,
    results: simulationResults,
    steps: simulationSteps,

    // Actions
    validate,
    run,
    reset,

    // Computed
    hasResults: !!simulationResults,
    isSuccess: simulationResults?.success === true,
    isError: simulationResults?.success === false,
  };
}

export default useSimulation;
