/**
 * Mock API service layer
 * Simulates backend API calls with in-memory data
 */

import { automations } from "./mockData";
import { getExecutionOrder } from "../utils/serialization";
import { NODE_TYPES } from "../constants/nodeTypes";

/**
 * Simulates network delay
 */
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

/**
 * GET /automations
 * Returns list of available automation actions
 */
export async function fetchAutomations() {
  await delay(300); // Simulate network latency
  return [...automations];
}

/**
 * POST /simulate
 * Simulates workflow execution and returns step-by-step results
 */
export async function simulateWorkflow(workflow, onStepUpdate) {
  const { nodes, edges } = workflow;
  const executionOrder = getExecutionOrder(nodes, edges);

  const results = [];
  const startTime = Date.now();

  for (const node of executionOrder) {
    const stepResult = {
      nodeId: node.id,
      nodeType: node.type,
      title: node.data?.title || node.type,
      status: "running",
      startedAt: new Date().toISOString(),
      completedAt: null,
      duration: null,
      output: null,
      error: null,
    };

    // Notify running status
    if (onStepUpdate) {
      onStepUpdate({ ...stepResult });
    }
    results.push(stepResult);

    // Simulate step execution with delay
    await delay(500 + Math.random() * 500);

    // Simulate step execution based on node type
    try {
      const output = await executeStep(node);
      stepResult.status = "completed";
      stepResult.output = output;
      stepResult.completedAt = new Date().toISOString();
      stepResult.duration = Date.now() - new Date(stepResult.startedAt).getTime();
    } catch (error) {
      stepResult.status = "error";
      stepResult.error = error.message;
      stepResult.completedAt = new Date().toISOString();
      stepResult.duration = Date.now() - new Date(stepResult.startedAt).getTime();

      // Notify error and stop execution
      if (onStepUpdate) {
        onStepUpdate({ ...stepResult });
      }
      break;
    }

    // Notify completion
    if (onStepUpdate) {
      onStepUpdate({ ...stepResult });
    }
  }

  const totalDuration = Date.now() - startTime;

  return {
    success: results.every(r => r.status === "completed"),
    startedAt: new Date(startTime).toISOString(),
    completedAt: new Date().toISOString(),
    totalDuration,
    steps: results,
  };
}

/**
 * Executes a single workflow step and returns output
 */
async function executeStep(node) {
  switch (node.type) {
    case NODE_TYPES.START:
      return {
        message: "Workflow started",
        metadata: node.data?.metadata || [],
      };
    case NODE_TYPES.TASK:
      // Simulate task completion
      return {
        message: `Task "${node.data?.title}" completed`,
        assignee: node.data?.assignee,
        completedBy: node.data?.assignee,
        completedAt: new Date().toISOString(),
      };

    case NODE_TYPES.APPROVAL:
      // Simulate approval (random success/reject for demo)
      const approved = Math.random() > 0.1; // 90% approval rate
      if (!approved) {
        throw new Error(`Approval rejected by ${node.data?.approverRole}`);
      }
      return {
        message: `Approved by ${node.data?.approverRole}`,
        approver: node.data?.approverRole,
        approvedAt: new Date().toISOString(),
      };

    case NODE_TYPES.AUTOMATED:
      // Simulate automation execution
      const automation = automations.find(a => a.id === node.data?.actionId);
      return {
        message: `Executed: ${automation?.label || node.data?.actionId}`,
        action: node.data?.actionId,
        parameters: node.data?.parameters,
        result: "Success",
      };

    case NODE_TYPES.END:
      return {
        message: node.data?.message || "Workflow completed",
        showSummary: node.data?.showSummary,
      };

    default:
      return { message: "Step completed" };
  }
}

/**
 * POST /workflow
 * Saves workflow (mock implementation)
 */
export async function saveWorkflow(workflow) {
  await delay(500);
  return {
    success: true,
    id: `wf_${Date.now()}`,
    savedAt: new Date().toISOString(),
  };
}

/**
 * GET /workflow/:id
 * Loads workflow (mock implementation)
 */
export async function loadWorkflow(id) {
  await delay(300);
  // In a real app, this would fetch from a database
  throw new Error("Workflow not found");
}
