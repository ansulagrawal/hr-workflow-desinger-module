/**
 * Mock data for the HR Workflow Designer
 */

export const automations = [
  {
    id: "send_email",
    label: "Send Email",
    description: "Send an email notification to specified recipients",
    params: [
      { name: "to", label: "To", type: "text", required: true },
      { name: "subject", label: "Subject", type: "text", required: true },
      { name: "body", label: "Body", type: "textarea", required: true },
    ],
  },
  {
    id: "generate_doc",
    label: "Generate Document",
    description: "Generate a document from a template",
    params: [
      {
        name: "template",
        label: "Template",
        type: "select",
        required: true,
        options: [
          { value: "offer_letter", label: "Offer Letter" },
          { value: "employment_contract", label: "Employment Contract" },
          { value: "nda", label: "NDA Agreement" },
          { value: "policy_acknowledgment", label: "Policy Acknowledgment" },
        ],
      },
      { name: "recipient", label: "Recipient", type: "text", required: true },
    ],
  },
  {
    id: "slack_notify",
    label: "Send Slack Notification",
    description: "Post a message to a Slack channel",
    params: [
      { name: "channel", label: "Channel", type: "text", required: true },
      { name: "message", label: "Message", type: "textarea", required: true },
    ],
  },
  {
    id: "create_ticket",
    label: "Create Support Ticket",
    description: "Create a ticket in the support system",
    params: [
      {
        name: "priority",
        label: "Priority",
        type: "select",
        required: true,
        options: [
          { value: "low", label: "Low" },
          { value: "medium", label: "Medium" },
          { value: "high", label: "High" },
          { value: "critical", label: "Critical" },
        ],
      },
      { name: "description", label: "Description", type: "textarea", required: true },
    ],
  },
  {
    id: "update_hris",
    label: "Update HRIS Record",
    description: "Update employee information in the HR system",
    params: [
      { name: "employeeId", label: "Employee ID", type: "text", required: true },
      {
        name: "field",
        label: "Field to Update",
        type: "select",
        required: true,
        options: [
          { value: "status", label: "Employment Status" },
          { value: "department", label: "Department" },
          { value: "title", label: "Job Title" },
          { value: "manager", label: "Manager" },
        ],
      },
      { name: "value", label: "New Value", type: "text", required: true },
    ],
  },
  {
    id: "schedule_meeting",
    label: "Schedule Meeting",
    description: "Schedule a calendar meeting",
    params: [
      { name: "title", label: "Meeting Title", type: "text", required: true },
      { name: "attendees", label: "Attendees (comma-separated)", type: "text", required: true },
      { name: "duration", label: "Duration (minutes)", type: "number", required: true },
    ],
  },
];

export const sampleWorkflows = {
  onboarding: {
    name: "Employee Onboarding",
    description: "Standard onboarding workflow for new hires",
    nodes: [
      {
        id: "start-1",
        type: "start",
        position: { x: 250, y: 50 },
        data: { title: "New Hire Received", metadata: [{ key: "trigger", value: "HRIS Event" }] },
      },
      {
        id: "task-1",
        type: "task",
        position: { x: 250, y: 150 },
        data: {
          title: "Collect Documents",
          description: "Collect required documents from new hire",
          assignee: "HR Coordinator",
          dueDate: "",
          customFields: [{ key: "documents", value: "ID, Tax Forms, Bank Details" }],
        },
      },
      {
        id: "approval-1",
        type: "approval",
        position: { x: 250, y: 250 },
        data: { title: "Manager Approval", approverRole: "Manager", autoApproveThreshold: 3 },
      },
      {
        id: "automated-1",
        type: "automated",
        position: { x: 250, y: 350 },
        data: {
          title: "Send Welcome Email",
          actionId: "send_email",
          parameters: { to: "{{employee.email}}", subject: "Welcome to the team!", body: "Welcome message..." },
        },
      },
      {
        id: "end-1",
        type: "end",
        position: { x: 250, y: 450 },
        data: { message: "Onboarding completed", showSummary: true },
      },
    ],
    edges: [
      { id: "e1", source: "start-1", target: "task-1" },
      { id: "e2", source: "task-1", target: "approval-1" },
      { id: "e3", source: "approval-1", target: "automated-1" },
      { id: "e4", source: "automated-1", target: "end-1" },
    ],
  },
};
