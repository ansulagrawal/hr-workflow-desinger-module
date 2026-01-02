/**
 * Workflow serialization utilities
 */

/**
 * Serializes the workflow to a JSON-exportable format
 */
export function serializeWorkflow(nodes, edges, metadata = {}) {
  return {
    version: "1.0.0",
    createdAt: new Date().toISOString(),
    metadata: {
      name: metadata.name || "Untitled Workflow",
      description: metadata.description || "",
      ...metadata,
    },
    nodes: nodes.map(node => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    })),
    edges: edges.map(edge => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    })),
  };
}

/**
 * Deserializes a workflow from JSON
 */
export function deserializeWorkflow(json) {
  try {
    const data = typeof json === "string" ? JSON.parse(json) : json;

    if (!data.nodes || !data.edges) {
      throw new Error("Invalid workflow format: missing nodes or edges");
    }

    return {
      nodes: data.nodes.map(node => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      })),
      edges: data.edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
      })),
      metadata: data.metadata || {},
    };
  } catch (error) {
    throw new Error(`Failed to parse workflow: ${error.message}`);
  }
}

/**
 * Downloads workflow as JSON file
 */
export function downloadWorkflowAsJson(nodes, edges, filename = "workflow.json") {
  const workflow = serializeWorkflow(nodes, edges);
  const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Gets execution order for simulation
 */
export function getExecutionOrder(nodes, edges) {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const inDegree = new Map();
  const outgoingEdges = new Map();

  // Initialize
  nodes.forEach(node => {
    inDegree.set(node.id, 0);
    outgoingEdges.set(node.id, []);
  });

  // Build graph
  edges.forEach(edge => {
    inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    outgoingEdges.get(edge.source)?.push(edge.target);
  });

  // Topological sort using Kahn's algorithm
  const queue = [];
  const result = [];

  // Start with nodes that have no incoming edges
  inDegree.forEach((degree, nodeId) => {
    if (degree === 0) {
      queue.push(nodeId);
    }
  });

  while (queue.length > 0) {
    const nodeId = queue.shift();
    const node = nodeMap.get(nodeId);
    if (node) {
      result.push(node);
    }

    const neighbors = outgoingEdges.get(nodeId) || [];
    neighbors.forEach(neighbor => {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    });
  }

  return result;
}
