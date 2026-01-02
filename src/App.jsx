import { ReactFlowProvider } from "@xyflow/react";
import { HelpCircle, Menu, Settings, Workflow, X } from "lucide-react";
import { useCallback, useEffect } from "react";
import { NodePalette, WorkflowCanvas } from "./components/canvas";
import { NodeFormPanel } from "./components/forms";
import { SandboxPanel } from "./components/sandbox";
import { Button } from "./components/ui";
import useUIStore from "./stores/uiStore";
import useWorkflowStore from "./stores/workflowStore";

/**
 * Header Component
 */
const Header = () => {
  const { isNodePaletteOpen, toggleNodePalette } = useUIStore();
  const { nodes, edges } = useWorkflowStore();

  return (
    <header className='h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0'>
      <div className='flex items-center gap-4'>
        <Button variant='ghost' size='icon' onClick={toggleNodePalette} title={isNodePaletteOpen ? "Hide Palette" : "Show Palette"}>
          {isNodePaletteOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
        </Button>

        <div className='flex items-center gap-2'>
          <div className='p-2 bg-blue-100 rounded-lg'>
            <Workflow className='w-5 h-5 text-blue-600' />
          </div>
          <div>
            <h1 className='font-semibold text-gray-900'>HR Workflow Designer</h1>
            <p className='text-xs text-gray-500'>Visual workflow builder</p>
          </div>
        </div>
      </div>

      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <span className='px-2 py-1 bg-gray-100 rounded'>
            {nodes.length} node{nodes.length !== 1 ? "s" : ""}
          </span>
          <span className='px-2 py-1 bg-gray-100 rounded'>
            {edges.length} connection{edges.length !== 1 ? "s" : ""}
          </span>
        </div>

        <Button variant='ghost' size='icon' title='Help'>
          <HelpCircle className='w-5 h-5' />
        </Button>
        <Button variant='ghost' size='icon' title='Settings'>
          <Settings className='w-5 h-5' />
        </Button>
      </div>
    </header>
  );
};

/**
 * Main App Component
 */
const App = () => {
  const { isNodePaletteOpen, isFormPanelOpen } = useUIStore();
  const { selectedNodeId, undo, redo, deleteNode, nodes } = useWorkflowStore();
  // Handle keyboard shortcuts
  const handleKeyDown = useCallback(
    event => {
      // Undo: Ctrl+Z
      if (event.ctrlKey && event.key === "z" && !event.shiftKey) {
        event.preventDefault();
        undo();
      }
      // Redo: Ctrl+Shift+Z or Ctrl+Y
      if ((event.ctrlKey && event.shiftKey && event.key === "z") || (event.ctrlKey && event.key === "y")) {
        event.preventDefault();
        redo();
      }
      // Delete selected node
      if ((event.key === "Delete" || event.key === "Backspace") && selectedNodeId) {
        // Only delete if not focused on an input
        if (document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
          event.preventDefault();
          deleteNode(selectedNodeId);
        }
      }
    },
    [undo, redo, deleteNode, selectedNodeId]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <ReactFlowProvider>
      <div className='h-screen w-screen flex flex-col bg-gray-100 overflow-hidden'>
        <Header />

        <div className='flex-1 flex overflow-hidden'>
          {/* Left Sidebar - Node Palette */}
          <NodePalette isOpen={isNodePaletteOpen} />

          {/* Main Canvas */}
          <WorkflowCanvas />

          {/* Right Sidebar - Node Form Panel */}
          <NodeFormPanel isOpen={isFormPanelOpen && !!selectedNodeId} />
        </div>

        {/* Sandbox Panel (Modal) */}
        <SandboxPanel />
      </div>
    </ReactFlowProvider>
  );
};

export default App;
