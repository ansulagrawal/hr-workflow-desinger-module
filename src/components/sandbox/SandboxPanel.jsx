import React, { useState, useCallback } from "react";
import { X, Play, RotateCcw, FileJson, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "../ui";
import { cn } from "../../utils/cn";
import ValidationErrors from "./ValidationErrors";
import ExecutionTimeline from "./ExecutionTimeline";
import useWorkflowStore from "../../stores/workflowStore";
import useUIStore from "../../stores/uiStore";
import { validateWorkflow } from "../../utils/validation";
import { serializeWorkflow } from "../../utils/serialization";
import { simulateWorkflow } from "../../services/api";

/**
 * SandboxPanel - Modal panel for workflow testing and validation
 */
const SandboxPanel = () => {
  const { nodes, edges } = useWorkflowStore();
  const { isSandboxOpen, closeSandbox, isSimulating, simulationResults, simulationSteps, startSimulation, updateSimulationStep, completeSimulation, clearSimulation } =
    useUIStore();

  const [activeTab, setActiveTab] = useState("validate");
  const [validationResult, setValidationResult] = useState(null);
  const [showJson, setShowJson] = useState(false);

  const handleValidate = useCallback(() => {
    const result = validateWorkflow(nodes, edges);
    setValidationResult(result);
  }, [nodes, edges]);

  const handleSimulate = useCallback(async () => {
    // First validate
    const validation = validateWorkflow(nodes, edges);
    setValidationResult(validation);

    if (!validation.isValid) {
      setActiveTab("validate");
      return;
    }

    // Start simulation
    startSimulation();
    setActiveTab("timeline");

    try {
      const workflow = { nodes, edges };
      const results = await simulateWorkflow(workflow, step => {
        updateSimulationStep(step);
      });
      completeSimulation(results);
    } catch (error) {
      completeSimulation({
        success: false,
        error: error.message,
      });
    }
  }, [nodes, edges, startSimulation, updateSimulationStep, completeSimulation]);

  const handleReset = () => {
    clearSimulation();
    setValidationResult(null);
    setActiveTab("validate");
  };

  const workflowJson = serializeWorkflow(nodes, edges);

  if (!isSandboxOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center animate-fade-in'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/50' onClick={closeSandbox} />

      {/* Panel */}
      <div className='relative w-full max-w-2xl max-h-[80vh] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>Workflow Sandbox</h2>
            <p className='text-sm text-gray-500'>Validate and test your workflow</p>
          </div>
          <Button variant='ghost' size='icon' onClick={closeSandbox}>
            <X className='w-5 h-5' />
          </Button>
        </div>

        {/* Tabs */}
        <div className='flex border-b border-gray-200'>
          <button
            onClick={() => setActiveTab("validate")}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === "validate" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            )}>
            Validation
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === "timeline" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            )}>
            Execution Timeline
          </button>
          <button
            onClick={() => setActiveTab("json")}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === "json" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-gray-700"
            )}>
            JSON Export
          </button>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto p-6'>
          {/* Validation Tab */}
          {activeTab === "validate" && (
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-medium text-gray-900'>Workflow Validation</h3>
                  <p className='text-sm text-gray-500'>Check your workflow for errors before testing</p>
                </div>
                <Button variant='outline' size='sm' onClick={handleValidate}>
                  Validate
                </Button>
              </div>

              {validationResult && <ValidationErrors errors={validationResult.errors} warnings={validationResult.warnings} />}

              {/* Workflow Stats */}
              <div className='grid grid-cols-3 gap-4 pt-4 border-t border-gray-200'>
                <div className='text-center p-3 bg-gray-50 rounded-lg'>
                  <p className='text-2xl font-bold text-gray-900'>{nodes.length}</p>
                  <p className='text-xs text-gray-500'>Nodes</p>
                </div>
                <div className='text-center p-3 bg-gray-50 rounded-lg'>
                  <p className='text-2xl font-bold text-gray-900'>{edges.length}</p>
                  <p className='text-xs text-gray-500'>Connections</p>
                </div>
                <div className='text-center p-3 bg-gray-50 rounded-lg'>
                  <p className='text-2xl font-bold text-gray-900'>
                    {validationResult?.isValid ? (
                      <CheckCircle2 className='w-6 h-6 text-green-500 mx-auto' />
                    ) : validationResult ? (
                      <XCircle className='w-6 h-6 text-red-500 mx-auto' />
                    ) : (
                      "—"
                    )}
                  </p>
                  <p className='text-xs text-gray-500'>Status</p>
                </div>
              </div>
            </div>
          )}
          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div>
              {simulationResults && (
                <div className={cn("mb-4 p-3 rounded-lg border", simulationResults.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200")}>
                  <div className='flex items-center gap-2'>
                    {simulationResults.success ? <CheckCircle2 className='w-5 h-5 text-green-600' /> : <XCircle className='w-5 h-5 text-red-600' />}
                    <span className={cn("font-medium", simulationResults.success ? "text-green-700" : "text-red-700")}>
                      {simulationResults.success ? "Simulation completed successfully" : "Simulation failed"}
                    </span>
                  </div>
                  {simulationResults.totalDuration && <p className='text-xs text-gray-500 mt-1'>Total duration: {simulationResults.totalDuration}ms</p>}
                </div>
              )}

              <ExecutionTimeline steps={simulationSteps} isSimulating={isSimulating} />
            </div>
          )}

          {/* JSON Tab */}
          {activeTab === "json" && (
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-medium text-gray-900'>Workflow JSON</h3>
                  <p className='text-sm text-gray-500'>Serialized workflow data for export</p>
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(workflowJson, null, 2));
                  }}>
                  <FileJson className='w-4 h-4 mr-1' />
                  Copy JSON
                </Button>
              </div>

              <pre className='bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-xs'>{JSON.stringify(workflowJson, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50'>
          <Button variant='outline' onClick={handleReset} disabled={isSimulating}>
            <RotateCcw className='w-4 h-4 mr-2' />
            Reset
          </Button>

          <div className='flex items-center gap-2'>
            <Button variant='secondary' onClick={closeSandbox}>
              Close
            </Button>
            <Button variant='primary' onClick={handleSimulate} disabled={isSimulating || nodes.length === 0}>
              {isSimulating ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Simulating...
                </>
              ) : (
                <>
                  <Play className='w-4 h-4 mr-2' />
                  Run Simulation
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SandboxPanel;
