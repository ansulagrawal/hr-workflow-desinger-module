/**
 * Node type constants and configuration
 */

export const NODE_TYPES = {
  START: "start",
  TASK: "task",
  APPROVAL: "approval",
  AUTOMATED: "automated",
  END: "end",
};

export const NODE_CONFIGS = {
  [NODE_TYPES.START]: {
    type: NODE_TYPES.START,
    label: "Start",
    description: "Workflow entry point",
    color: "emerald",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-500",
    textColor: "text-emerald-700",
    iconBg: "bg-emerald-100",
    defaultData: {
      title: "Start",
      metadata: [],
    },
  },
  [NODE_TYPES.TASK]: {
    type: NODE_TYPES.TASK,
    label: "Task",
    description: "Human task step",
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-500",
    textColor: "text-blue-700",
    iconBg: "bg-blue-100",
    defaultData: {
      title: "New Task",
      description: "",
      assignee: "",
      dueDate: "",
      customFields: [],
    },
  },
  [NODE_TYPES.APPROVAL]: {
    type: NODE_TYPES.APPROVAL,
    label: "Approval",
    description: "Approval step",
    color: "orange",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-500",
    textColor: "text-orange-700",
    iconBg: "bg-orange-100",
    defaultData: {
      title: "Approval Step",
      approverRole: "Manager",
      autoApproveThreshold: 0,
    },
  },
  [NODE_TYPES.AUTOMATED]: {
    type: NODE_TYPES.AUTOMATED,
    label: "Automated",
    description: "System action",
    color: "purple",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-500",
    textColor: "text-purple-700",
    iconBg: "bg-purple-100",
    defaultData: {
      title: "Automated Step",
      actionId: "",
      parameters: {},
    },
  },
  [NODE_TYPES.END]: {
    type: NODE_TYPES.END,
    label: "End",
    description: "Workflow completion",
    color: "red",
    bgColor: "bg-red-50",
    borderColor: "border-red-500",
    textColor: "text-red-700",
    iconBg: "bg-red-100",
    defaultData: {
      message: "Workflow completed successfully",
      showSummary: false,
    },
  },
};

export const APPROVER_ROLES = [
  { value: "Manager", label: "Manager" },
  { value: "HRBP", label: "HRBP" },
  { value: "Director", label: "Director" },
  { value: "VP", label: "VP" },
];

export const GRID_SIZE = 20;
