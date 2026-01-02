import React from "react";
import { ZoomIn, ZoomOut, Maximize2, Undo2, Redo2, Trash2, Download, Upload, Play } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { Button } from "../ui";
import { cn } from "../../utils/cn.js";
import useWorkflowStore from "../../stores/workflowStore";
import useUIStore from "../../stores/uiStore";
import { downloadWorkflowAsJson, deserializeWorkflow } from "../../utils/serialization";

/**
 * CanvasControls - Floating control buttons for canvas operations
 */
const CanvasControls = () => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const { nodes, edges, undo, redo, canUndo, canRedo, clearWorkflow, loadWorkflow } = useWorkflowStore();
  const { openSandbox } = useUIStore();

  const handleExport = () => {
    downloadWorkflowAsJson(nodes, edges, "hr-workflow.json");
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async e => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const workflow = deserializeWorkflow(text);
        loadWorkflow(workflow);
      } catch (error) {
        console.error("Failed to import workflow:", error);
        alert("Failed to import workflow. Please check the file format.");
      }
    };
    input.click();
  };

  const handleClear = () => {
    if (nodes.length === 0) return;
    if (confirm("Are you sure you want to clear the entire workflow?")) {
      clearWorkflow();
    }
  };

  return (
    <div className='absolute bottom-4 left-1/2 -translate-x-1/2 z-10'>
      <div className='flex items-center gap-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2'>
        {/* Zoom Controls */}
        <div className='flex items-center gap-1 pr-2 border-r border-gray-200'>
          <Button variant='ghost' size='icon' onClick={() => zoomOut()} title='Zoom Out'>
            <ZoomOut className='w-4 h-4' />
          </Button>
          <Button variant='ghost' size='icon' onClick={() => zoomIn()} title='Zoom In'>
            <ZoomIn className='w-4 h-4' />
          </Button>
          <Button variant='ghost' size='icon' onClick={() => fitView({ padding: 0.2 })} title='Fit View'>
            <Maximize2 className='w-4 h-4' />
          </Button>
        </div>

        {/* History Controls */}
        <div className='flex items-center gap-1 pr-2 border-r border-gray-200'>
          <Button variant='ghost' size='icon' onClick={undo} disabled={!canUndo()} title='Undo (Ctrl+Z)'>
            <Undo2 className='w-4 h-4' />
          </Button>
          <Button variant='ghost' size='icon' onClick={redo} disabled={!canRedo()} title='Redo (Ctrl+Shift+Z)'>
            <Redo2 className='w-4 h-4' />
          </Button>
        </div>

        {/* Workflow Controls */}
        <div className='flex items-center gap-1 pr-2 border-r border-gray-200'>
          <Button variant='ghost' size='icon' onClick={handleImport} title='Import Workflow'>
            <Upload className='w-4 h-4' />
          </Button>
          <Button variant='ghost' size='icon' onClick={handleExport} disabled={nodes.length === 0} title='Export Workflow'>
            <Download className='w-4 h-4' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleClear}
            disabled={nodes.length === 0}
            title='Clear Workflow'
            className='text-red-500 hover:text-red-600 hover:bg-red-50'>
            <Trash2 className='w-4 h-4' />
          </Button>
        </div>

        {/* Test Button */}
        <Button variant='primary' size='sm' onClick={openSandbox} disabled={nodes.length === 0} className='gap-2'>
          <Play className='w-4 h-4' />
          Test Workflow
        </Button>
      </div>
    </div>
  );
};

export default CanvasControls;
