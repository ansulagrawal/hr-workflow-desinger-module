import { NODE_TYPES } from "../../constants/nodeTypes";
import StartNode from "./StartNode";
import TaskNode from "./TaskNode";
import ApprovalNode from "./ApprovalNode";
import AutomatedNode from "./AutomatedNode";
import EndNode from "./EndNode";

/**
 * Node types registry for React Flow
 */
export const nodeTypes = {
  [NODE_TYPES.START]: StartNode,
  [NODE_TYPES.TASK]: TaskNode,
  [NODE_TYPES.APPROVAL]: ApprovalNode,
  [NODE_TYPES.AUTOMATED]: AutomatedNode,
  [NODE_TYPES.END]: EndNode,
};

export { StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode };
