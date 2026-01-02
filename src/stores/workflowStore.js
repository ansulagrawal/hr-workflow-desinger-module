/**
 * Workflow Store - Manages workflow nodes, edges, and operations
 */

import { create } from "zustand";
import { nanoid } from "nanoid";
import { NODE_CONFIGS, NODE_TYPES, GRID_SIZE } from "../constants/nodeTypes";

const useWorkflowStore = create((set, get) => ({
  // State
  nodes: [],
  edges: [],
  selectedNodeId: null,
  history: [],
  historyIndex: -1,

  // Node Operations
  addNode: (type, position) => {
    const config = NODE_CONFIGS[type];
    if (!config) return null;

    // Snap to grid
    const snappedPosition = {
      x: Math.round(position.x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(position.y / GRID_SIZE) * GRID_SIZE,
    };

    const newNode = {
      id: `${type}-${nanoid(8)}`,
      type,
      position: snappedPosition,
      data: { ...config.defaultData },
    };

    set(state => {
      const newNodes = [...state.nodes, newNode];
      return {
        nodes: newNodes,
        selectedNodeId: newNode.id,
        ...get().pushToHistory(newNodes, state.edges),
      };
    });

    return newNode;
  },

  updateNode: (nodeId, updates) => {
    set(state => {
      const newNodes = state.nodes.map(node => (node.id === nodeId ? { ...node, ...updates, data: { ...node.data, ...updates.data } } : node));
      return { nodes: newNodes };
    });
  },

  updateNodeData: (nodeId, data) => {
    set(state => {
      const newNodes = state.nodes.map(node => (node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node));
      return { nodes: newNodes };
    });
  },

  deleteNode: nodeId => {
    set(state => {
      const newNodes = state.nodes.filter(node => node.id !== nodeId);
      const newEdges = state.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);
      return {
        nodes: newNodes,
        edges: newEdges,
        selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
        ...get().pushToHistory(newNodes, newEdges),
      };
    });
  },

  setNodes: nodes => {
    set({ nodes });
  },

  onNodesChange: changes => {
    set(state => {
      let newNodes = [...state.nodes];
      let selectedNodeId = state.selectedNodeId;

      changes.forEach(change => {
        switch (change.type) {
          case "position":
            if (change.position) {
              newNodes = newNodes.map(node =>
                node.id === change.id
                  ? {
                      ...node,
                      position: {
                        x: Math.round(change.position.x / GRID_SIZE) * GRID_SIZE,
                        y: Math.round(change.position.y / GRID_SIZE) * GRID_SIZE,
                      },
                    }
                  : node
              );
            }
            break;
          case "select":
            if (change.selected) {
              selectedNodeId = change.id;
            } else if (selectedNodeId === change.id) {
              selectedNodeId = null;
            }
            break;
          case "remove":
            newNodes = newNodes.filter(node => node.id !== change.id);
            if (selectedNodeId === change.id) {
              selectedNodeId = null;
            }
            break;
          default:
            break;
        }
      });

      return { nodes: newNodes, selectedNodeId };
    });
  },

  // Edge Operations
  addEdge: connection => {
    const edgeId = `edge-${nanoid(8)}`;
    const newEdge = {
      id: edgeId,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle,
      type: "smoothstep",
      animated: false,
    };

    set(state => {
      // Check for duplicate edges
      const isDuplicate = state.edges.some(e => e.source === connection.source && e.target === connection.target);
      if (isDuplicate) return state;

      const newEdges = [...state.edges, newEdge];
      return {
        edges: newEdges,
        ...get().pushToHistory(state.nodes, newEdges),
      };
    });
  },

  deleteEdge: edgeId => {
    set(state => {
      const newEdges = state.edges.filter(edge => edge.id !== edgeId);
      return {
        edges: newEdges,
        ...get().pushToHistory(state.nodes, newEdges),
      };
    });
  },

  setEdges: edges => {
    set({ edges });
  },

  onEdgesChange: changes => {
    set(state => {
      let newEdges = [...state.edges];

      changes.forEach(change => {
        switch (change.type) {
          case "remove":
            newEdges = newEdges.filter(edge => edge.id !== change.id);
            break;
          case "select":
            // Handle edge selection if needed
            break;
          default:
            break;
        }
      });

      return { edges: newEdges };
    });
  },

  // Selection
  selectNode: nodeId => {
    set({ selectedNodeId: nodeId });
  },
  clearSelection: () => {
    set({ selectedNodeId: null });
  },

  getSelectedNode: () => {
    const state = get();
    return state.nodes.find(node => node.id === state.selectedNodeId);
  },

  // History (Undo/Redo)
  pushToHistory: (nodes, edges) => {
    const state = get();
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push({ nodes: [...nodes], edges: [...edges] });

    // Limit history size
    if (newHistory.length > 50) {
      newHistory.shift();
    }

    return {
      history: newHistory,
      historyIndex: newHistory.length - 1,
    };
  },

  undo: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const prevState = state.history[state.historyIndex - 1];
      set({
        nodes: prevState.nodes,
        edges: prevState.edges,
        historyIndex: state.historyIndex - 1,
      });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const nextState = state.history[state.historyIndex + 1];
      set({
        nodes: nextState.nodes,
        edges: nextState.edges,
        historyIndex: state.historyIndex + 1,
      });
    }
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  // Workflow Operations
  clearWorkflow: () => {
    set({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      history: [],
      historyIndex: -1,
    });
  },

  loadWorkflow: workflow => {
    set({
      nodes: workflow.nodes || [],
      edges: workflow.edges || [],
      selectedNodeId: null,
      history: [{ nodes: workflow.nodes || [], edges: workflow.edges || [] }],
      historyIndex: 0,
    });
  },

  // Validation helpers
  hasStartNode: () => {
    return get().nodes.some(node => node.type === NODE_TYPES.START);
  },

  hasEndNode: () => {
    return get().nodes.some(node => node.type === NODE_TYPES.END);
  },

  getStartNodeCount: () => {
    return get().nodes.filter(node => node.type === NODE_TYPES.START).length;
  },
}));

export default useWorkflowStore;
