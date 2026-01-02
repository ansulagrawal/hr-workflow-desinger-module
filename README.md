# HR Workflow Designer Module

A production-ready React application for designing, configuring, and testing HR workflows visually. Built with React 19, React Flow, and modern best practices.

![HR Workflow Designer](https://via.placeholder.com/800x400?text=HR+Workflow+Designer)

## 🚀 Features

- **Visual Workflow Canvas**: Drag-and-drop interface for building workflows
- **5 Custom Node Types**: Start, Task, Approval, Automated, and End nodes
- **Dynamic Configuration Forms**: Context-aware forms for each node type
- **Workflow Validation**: Real-time validation with detailed error messages
- **Simulation Engine**: Test workflows with step-by-step execution timeline
- **Import/Export**: Save and load workflows as JSON
- **Undo/Redo**: Full history management with keyboard shortcuts
- **Mini-map Navigation**: Overview navigation for large workflows

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Architecture Overview](#architecture-overview)
- [Node Types](#node-types)
- [Design Decisions](#design-decisions)
- [API Reference](#api-reference)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)

## 🛠️ Tech Stack

| Technology            | Version | Purpose                      |
| --------------------- | ------- | ---------------------------- |
| React                 | 19.x    | Core UI framework            |
| Vite                  | 6.x     | Build tool & dev server      |
| @xyflow/react         | 12.x    | Workflow canvas (React Flow) |
| Zustand               | 5.x     | State management             |
| Tailwind CSS          | 4.x     | Styling                      |
| clsx + tailwind-merge | Latest  | Conditional class handling   |
| Lucide React          | Latest  | Icon library                 |
| nanoid                | 5.x     | Unique ID generation         |

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

```bash
# Navigate to project directory
cd hr-workflow-designer

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:5173`

## 🏗️ Architecture Overview

```
src/
├── components/
│   ├── canvas/              # Workflow canvas components
│   │   ├── WorkflowCanvas.jsx    # Main React Flow wrapper
│   │   ├── NodePalette.jsx       # Draggable node sidebar
│   │   └── CanvasControls.jsx    # Zoom, undo/redo controls
│   ├── nodes/               # Custom React Flow nodes
│   │   ├── BaseNode.jsx          # Reusable base component
│   │   ├── StartNode.jsx         # Green - workflow entry
│   │   ├── TaskNode.jsx          # Blue - human tasks
│   │   ├── ApprovalNode.jsx      # Orange - approval steps
│   │   ├── AutomatedNode.jsx     # Purple - system actions
│   │   └── EndNode.jsx           # Red - workflow completion
│   ├── forms/               # Node configuration forms
│   │   ├── NodeFormPanel.jsx     # Right sidebar container
│   │   ├── StartNodeForm.jsx
│   │   ├── TaskNodeForm.jsx
│   │   ├── ApprovalNodeForm.jsx
│   │   ├── AutomatedNodeForm.jsx
│   │   ├── EndNodeForm.jsx
│   │   └── shared/
│   │       ├── KeyValueEditor.jsx  # Reusable key-value pairs
│   │       └── FormField.jsx
│   ├── sandbox/             # Testing & simulation
│   │   ├── SandboxPanel.jsx      # Modal for testing
│   │   ├── ExecutionTimeline.jsx # Step-by-step results
│   │   └── ValidationErrors.jsx  # Error/warning display
│   └── ui/                  # Reusable UI primitives
│       ├── Button.jsx
│       ├── Input.jsx
│       ├── Select.jsx
│       ├── Toggle.jsx
│       └── Textarea.jsx
├── hooks/                   # Custom React hooks
│   ├── useWorkflow.js           # Workflow operations
│   ├── useNodeForm.js           # Form state management
│   ├── useSimulation.js         # Simulation control
│   └── useAutomations.js        # Automation actions
├── stores/                  # Zustand state stores
│   ├── workflowStore.js         # Nodes, edges, history
│   └── uiStore.js               # UI state, simulation
├── services/                # API layer
│   ├── api.js                   # Mock API functions
│   └── mockData.js              # Sample data
├── utils/                   # Utility functions
│   ├── cn.js                    # Tailwind class merge
│   ├── validation.js            # Workflow validation
│   └── serialization.js         # JSON import/export
├── constants/               # Configuration
│   └── nodeTypes.js             # Node type definitions
├── App.jsx                  # Root component
├── main.jsx                 # Entry point
└── index.css                # Global styles
```

## 📦 Node Types

### Start Node (Green)

- **Purpose**: Entry point of the workflow
- **Constraints**: Only one per workflow, no incoming connections
- **Configuration**:
  - Title (required)
  - Metadata (key-value pairs)

### Task Node (Blue)

- **Purpose**: Human tasks requiring manual action
- **Configuration**:
  - Title (required)
  - Description
  - Assignee (required)
  - Due Date
  - Custom Fields (key-value pairs)

### Approval Node (Orange)

- **Purpose**: Approval gates requiring manager/HR sign-off
- **Configuration**:
  - Title (required)
  - Approver Role (Manager, HRBP, Director, VP)
  - Auto-Approve Threshold (days)

### Automated Node (Purple)

- **Purpose**: System actions executed automatically
- **Configuration**:
  - Title (required)
  - Action (from API)
  - Dynamic parameters based on selected action

### End Node (Red)

- **Purpose**: Workflow completion point
- **Constraints**: No outgoing connections
- **Configuration**:
  - Completion Message
  - Show Summary toggle

## 🎨 Design Decisions

### State Management with Zustand

Chose Zustand over Redux for:

- Minimal boilerplate
- No provider wrappers needed
- Built-in devtools support
- Excellent TypeScript support (for future migration)
- Simple API for undo/redo implementation

### React Flow for Canvas

The `@xyflow/react` library provides:

- Highly performant canvas rendering
- Built-in drag-and-drop
- Connection validation
- Mini-map and controls
- Snap-to-grid functionality

### Component Architecture

- **Compound components**: Forms are composed of reusable primitives
- **Colocation**: Related files grouped by feature (nodes, forms, canvas)
- **Controlled components**: All form inputs are controlled for predictability

### Validation Strategy

- **Graph traversal**: Uses BFS for reachability and DFS for cycle detection
- **Real-time feedback**: Validation runs before simulation
- **Detailed errors**: Each error includes context and affected node IDs

## 📡 API Reference

### GET /automations

Returns available automation actions for the Automated node type.

```json
[
  {
    "id": "send_email",
    "label": "Send Email",
    "description": "Send an email notification",
    "params": [
      { "name": "to", "label": "To", "type": "text", "required": true },
      { "name": "subject", "label": "Subject", "type": "text", "required": true },
      { "name": "body", "label": "Body", "type": "textarea", "required": true }
    ]
  }
]
```

### POST /simulate

Simulates workflow execution with step-by-step updates.

**Request:**

```json
{
  "nodes": [...],
  "edges": [...]
}
```

**Response:**

```json
{
  "success": true,
  "startedAt": "2024-01-01T00:00:00.000Z",
  "completedAt": "2024-01-01T00:00:05.000Z",
  "totalDuration": 5000,
  "steps": [
    {
      "nodeId": "start-abc123",
      "status": "completed",
      "output": { "message": "Workflow started" }
    }
  ]
}
```

## ⌨️ Keyboard Shortcuts

| Shortcut                        | Action               |
| ------------------------------- | -------------------- |
| `Ctrl + Z`                      | Undo                 |
| `Ctrl + Shift + Z` / `Ctrl + Y` | Redo                 |
| `Delete` / `Backspace`          | Delete selected node |
| `Drag`                          | Move nodes on canvas |

## ⚠️ Known Limitations

1. **No persistent storage**: Workflows are stored in memory only
2. **Single workflow**: Only one workflow can be edited at a time
3. **No branching logic**: Conditional paths not yet supported
4. **Mock simulation**: Simulation is randomized, not based on real data
5. **No multi-select**: Can only select/edit one node at a time
6. **No edge labels**: Connections don't support labels or conditions

## 🚀 Future Improvements

### Short-term

- [ ] Local storage persistence
- [ ] Edge labels for conditional branching
- [ ] Multi-select nodes
- [ ] Copy/paste nodes
- [ ] Auto-layout algorithm

### Medium-term

- [ ] Conditional branching (if/else nodes)
- [ ] Loop/iteration nodes
- [ ] Sub-workflow references
- [ ] Template library
- [ ] Collaboration (real-time editing)

### Long-term

- [ ] Backend integration with real APIs
- [ ] Version control for workflows
- [ ] Role-based access control
- [ ] Audit logging
- [ ] Analytics dashboard

## 📄 License

MIT License - feel free to use this project for learning and development.

---

Built with ❤️ using React, React Flow, and Tailwind CSS
