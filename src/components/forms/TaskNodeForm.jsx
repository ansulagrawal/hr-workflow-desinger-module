import React from "react";
import { Input, Textarea } from "../ui";
import KeyValueEditor from "./shared/KeyValueEditor";

/**
 * TaskNodeForm - Configuration form for Task nodes
 */
const TaskNodeForm = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className='space-y-4'>
      <Input label='Title' required value={data?.title || ""} onChange={e => handleChange("title", e.target.value)} placeholder='Enter task title' />

      <Textarea
        label='Description'
        value={data?.description || ""}
        onChange={e => handleChange("description", e.target.value)}
        placeholder='Describe what this task involves...'
        rows={3}
      />

      <Input label='Assignee' required value={data?.assignee || ""} onChange={e => handleChange("assignee", e.target.value)} placeholder='e.g., HR Coordinator, John Doe' />

      <Input label='Due Date' type='date' value={data?.dueDate || ""} onChange={e => handleChange("dueDate", e.target.value)} />

      <KeyValueEditor
        label='Custom Fields'
        items={data?.customFields || []}
        onChange={items => handleChange("customFields", items)}
        keyPlaceholder='Field Name'
        valuePlaceholder='Field Value'
      />

      <p className='text-xs text-gray-500'>Custom fields allow you to capture additional task-specific information.</p>
    </div>
  );
};

export default TaskNodeForm;
