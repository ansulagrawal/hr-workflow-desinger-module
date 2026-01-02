/**
 * Workflow validation utilities
 */

import { NODE_TYPES } from "../constants/nodeTypes";

/**
 * Validates the workflow structure and returns validation results
 * @param {Array} nodes - Array of workflow nodes
 * @param {Array} edges - Array of workflow edges
 * @returns {Object} - Validation result with isValid flag and errors array
 */
export function validateWorkflow(nodes, edges) {
  const errors = [];
  const warnings = [];

  // Check for empty workflow
  if (nodes.length === 0) {
    errors.push({
      type: "error",
      code: "EMPTY_WORKFLOW",
      message: "Workflow must have at least one node",
    });
    return { isValid: false, errors, warnings };
  }

  // Get node counts by type
  const startNodes = nodes.filter(n => n.type === NODE_TYPES.START);
  const endNodes = nodes.filter(n => n.type === NODE_TYPES.END);

  // Check for exactly one Start node
  if (startNodes.length === 0) {
    errors.push({
      type: "error",
      code: "NO_START_NODE",
      message: "Workflow must have exactly one Start node",
    });
  } else if (startNodes.length > 1) {
    errors.push({
      type: "error",
      code: "MULTIPLE_START_NODES",
      message: `Workflow has ${startNodes.length} Start nodes, but only one is allowed`,
      nodeIds: startNodes.map(n => n.id),
    });
  }

  // Check for at least one End node
  if (endNodes.length === 0) {
    errors.push({
      type: "error",
      code: "NO_END_NODE",
      message: "Workflow must have at least one End node",
    });
  }

  // Build adjacency maps for graph traversal
  const outgoingEdges = new Map();
  const incomingEdges = new Map();

  nodes.forEach(node => {
    outgoingEdges.set(node.id, []);
    incomingEdges.set(node.id, []);
  });

  edges.forEach(edge => {
    if (outgoingEdges.has(edge.source)) {
      outgoingEdges.get(edge.source).push(edge.target);
    }
    if (incomingEdges.has(edge.target)) {
      incomingEdges.get(edge.target).push(edge.source);
    }
  });

  // Check Start node has no incoming edges
  startNodes.forEach(startNode => {
    const incoming = incomingEdges.get(startNode.id) || [];
    if (incoming.length > 0) {
      errors.push({
        type: "error",
        code: "START_HAS_INCOMING",
        message: "Start node cannot have incoming connections",
        nodeId: startNode.id,
      });
    }
  });

  // Check End nodes have no outgoing edges
  endNodes.forEach(endNode => {
    const outgoing = outgoingEdges.get(endNode.id) || [];
    if (outgoing.length > 0) {
      errors.push({
        type: "error",
        code: "END_HAS_OUTGOING",
        message: "End node cannot have outgoing connections",
        nodeId: endNode.id,
      });
    }
  });

  // Check for orphan nodes (not connected to the graph)
  const visited = new Set();
  const queue = [...startNodes.map(n => n.id)];

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (visited.has(nodeId)) continue;
    visited.add(nodeId);

    const neighbors = outgoingEdges.get(nodeId) || [];
    neighbors.forEach(neighbor => {
      if (!visited.has(neighbor)) {
        queue.push(neighbor);
      }
    });
  }

  const orphanNodes = nodes.filter(n => !visited.has(n.id) && n.type !== NODE_TYPES.START);
  if (orphanNodes.length > 0) {
    errors.push({
      type: "error",
      code: "ORPHAN_NODES",
      message: `${orphanNodes.length} node(s) are not reachable from the Start node`,
      nodeIds: orphanNodes.map(n => n.id),
    });
  }

  // Check for circular dependencies using DFS
  const hasCycle = detectCycle(nodes, outgoingEdges);
  if (hasCycle) {
    errors.push({
      type: "error",
      code: "CIRCULAR_DEPENDENCY",
      message: "Workflow contains circular dependencies",
    });
  }

  // Check for nodes without outgoing edges (except End nodes)
  nodes.forEach(node => {
    if (node.type !== NODE_TYPES.END) {
      const outgoing = outgoingEdges.get(node.id) || [];
      if (outgoing.length === 0) {
        warnings.push({
          type: "warning",
          code: "DEAD_END",
          message: `Node "${node.data?.title || node.id}" has no outgoing connections`,
          nodeId: node.id,
        });
      }
    }
  });

  // Check for nodes without incoming edges (except Start nodes)
  nodes.forEach(node => {
    if (node.type !== NODE_TYPES.START) {
      const incoming = incomingEdges.get(node.id) || [];
      if (incoming.length === 0) {
        warnings.push({
          type: "warning",
          code: "UNREACHABLE",
          message: `Node "${node.data?.title || node.id}" has no incoming connections`,
          nodeId: node.id,
        });
      }
    }
  });

  // Validate node data
  nodes.forEach(node => {
    const nodeErrors = validateNodeData(node);
    errors.push(...nodeErrors);
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Detects cycles in the workflow graph using DFS
 */
function detectCycle(nodes, outgoingEdges) {
  const visited = new Set();
  const recursionStack = new Set();

  function dfs(nodeId) {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    const neighbors = outgoingEdges.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (recursionStack.has(neighbor)) {
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }
  for (const node of nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id)) return true;
    }
  }

  return false;
}

/**
 * Validates individual node data based on node type
 */
function validateNodeData(node) {
  const errors = [];

  switch (node.type) {
    case NODE_TYPES.START:
      if (!node.data?.title?.trim()) {
        errors.push({
          type: "error",
          code: "MISSING_TITLE",
          message: "Start node must have a title",
          nodeId: node.id,
        });
      }
      break;

    case NODE_TYPES.TASK:
      if (!node.data?.title?.trim()) {
        errors.push({
          type: "error",
          code: "MISSING_TITLE",
          message: "Task node must have a title",
          nodeId: node.id,
        });
      }
      if (!node.data?.assignee?.trim()) {
        errors.push({
          type: "error",
          code: "MISSING_ASSIGNEE",
          message: `Task "${node.data?.title || node.id}" must have an assignee`,
          nodeId: node.id,
        });
      }
      break;

    case NODE_TYPES.APPROVAL:
      if (!node.data?.title?.trim()) {
        errors.push({
          type: "error",
          code: "MISSING_TITLE",
          message: "Approval node must have a title",
          nodeId: node.id,
        });
      }
      if (!node.data?.approverRole) {
        errors.push({
          type: "error",
          code: "MISSING_APPROVER_ROLE",
          message: `Approval "${node.data?.title || node.id}" must have an approver role`,
          nodeId: node.id,
        });
      }
      break;

    case NODE_TYPES.AUTOMATED:
      if (!node.data?.title?.trim()) {
        errors.push({
          type: "error",
          code: "MISSING_TITLE",
          message: "Automated node must have a title",
          nodeId: node.id,
        });
      }
      if (!node.data?.actionId) {
        errors.push({
          type: "error",
          code: "MISSING_ACTION",
          message: `Automated step "${node.data?.title || node.id}" must have an action selected`,
          nodeId: node.id,
        });
      }
      break;

    case NODE_TYPES.END:
      // End node has no required fields
      break;
  }

  return errors;
}

/**
 * Checks if a connection is valid
 */
export function isValidConnection(connection, nodes, edges) {
  const sourceNode = nodes.find(n => n.id === connection.source);
  const targetNode = nodes.find(n => n.id === connection.target);

  if (!sourceNode || !targetNode) return false;

  // Cannot connect to self
  if (connection.source === connection.target) return false;

  // End nodes cannot have outgoing connections
  if (sourceNode.type === NODE_TYPES.END) return false;

  // Start nodes cannot have incoming connections
  if (targetNode.type === NODE_TYPES.START) return false;

  // Check for duplicate connections
  const isDuplicate = edges.some(e => e.source === connection.source && e.target === connection.target);
  if (isDuplicate) return false;

  return true;
}
