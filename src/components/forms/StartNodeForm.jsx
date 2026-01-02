import React from "react";
import { Input } from "../ui";
import KeyValueEditor from "./shared/KeyValueEditor";

/**
 * StartNodeForm - Configuration form for Start nodes
 */
const StartNodeForm = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className='space-y-4'>
      <Input label='Title' required value={data?.title || ""} onChange={e => handleChange("title", e.target.value)} placeholder='Enter workflow start title' />

      <KeyValueEditor label='Metadata' items={data?.metadata || []} onChange={items => handleChange("metadata", items)} keyPlaceholder='Property' valuePlaceholder='Value' />

      <p className='text-xs text-gray-500'>Add metadata to store additional information about the workflow trigger.</p>
    </div>
  );
};

export default StartNodeForm;
