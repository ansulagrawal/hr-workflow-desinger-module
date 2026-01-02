import React, { useCallback, useRef } from "react";
import { ReactFlow, Background, Controls, MiniMap, addEdge, useReactFlow } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { nodeTypes } from "../nodes";
import CanvasControls from "./CanvasControls";
import useWorkflowStore from "../../stores/workflowStore";
import { NODE_TYPES, NODE_CONFIGS, GRID_SIZE } from "../../constants/nodeTypes";
import { isValidConnection } from "../../utils/validation";

/**
 * WorkflowCanvas - Main React Flow canvas component
 */
const WorkflowCanvas = () => {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();

  const { nodes, edges, onNodesChange, onEdgesChange, addEdge: storeAddEdge, addNode, deleteNode, selectNode, clearSelection } = useWorkflowStore();

  // Handle new connections
  const onConnect = useCallback(
    connection => {
      if (isValidConnection(connection, nodes, edges)) {
        storeAddEdge(connection);
      }
    },
    [nodes, edges, storeAddEdge]
  );

  // Handle connection validation
  const isValidConnectionCheck = useCallback(
    connection => {
      return isValidConnection(connection, nodes, edges);
    },
    [nodes, edges]
  );

  // Handle drag over for node palette
  const onDragOver = useCallback(event => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle drop from node palette
  const onDrop = useCallback(
    event => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type || !NODE_CONFIGS[type]) return;

      // Check if trying to add another Start node
      if (type === NODE_TYPES.START) {
        const startNodeExists = nodes.some(n => n.type === NODE_TYPES.START);
        if (startNodeExists) {
          alert("Only one Start node is allowed per workflow");
          return;
        }
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [nodes, addNode, screenToFlowPosition]
  );

  // Handle node click
  const onNodeClick = useCallback(
    (event, node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  // Handle pane click (deselect)
  const onPaneClick = useCallback(() => {
    clearSelection();
  }, [clearSelection]);

  // Handle keyboard shortcuts
  const onKeyDown = useCallback(
    event => {
      if (event.key === "Delete" || event.key === "Backspace") {
        const selectedNode = nodes.find(n => n.selected);
        if (selectedNode) {
          deleteNode(selectedNode.id);
        }
      }
    },
    [nodes, deleteNode]
  );

  // Custom minimap node color
  const nodeColor = node => {
    const config = NODE_CONFIGS[node.type];
    if (!config) return "#94a3b8";

    const colorMap = {
      emerald: "#10b981",
      blue: "#3b82f6",
      orange: "#f97316",
      purple: "#a855f7",
      red: "#ef4444",
    };

    return colorMap[config.color] || "#94a3b8";
  };
  return (
    <div ref={reactFlowWrapper} className='flex-1 h-full bg-gray-50' onKeyDown={onKeyDown} tabIndex={0}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        isValidConnection={isValidConnectionCheck}
        snapToGrid={true}
        snapGrid={[GRID_SIZE, GRID_SIZE]}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: false,
          style: { strokeWidth: 2, stroke: "#94a3b8" },
        }}
        connectionLineStyle={{ strokeWidth: 2, stroke: "#3b82f6" }}
        connectionLineType='smoothstep'
        deleteKeyCode={["Delete", "Backspace"]}
        proOptions={{ hideAttribution: true }}>
        <Background color='#e2e8f0' gap={GRID_SIZE} size={1} />
        <MiniMap nodeColor={nodeColor} maskColor='rgba(0, 0, 0, 0.1)' className='!bg-white !border-gray-200' pannable zoomable />
        <CanvasControls />
      </ReactFlow>
    </div>
  );
};

export default WorkflowCanvas;
