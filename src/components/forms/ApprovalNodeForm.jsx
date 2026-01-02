import React from "react";
import { Input, Select } from "../ui";
import { APPROVER_ROLES } from "../../constants/nodeTypes";

/**
 * ApprovalNodeForm - Configuration form for Approval nodes
 */
const ApprovalNodeForm = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className='space-y-4'>
      <Input label='Title' required value={data?.title || ""} onChange={e => handleChange("title", e.target.value)} placeholder='Enter approval step title' />

      <Select
        label='Approver Role'
        required
        value={data?.approverRole || ""}
        onChange={e => handleChange("approverRole", e.target.value)}
        options={APPROVER_ROLES}
        placeholder='Select approver role'
      />

      <Input
        label='Auto-Approve Threshold (Days)'
        type='number'
        min='0'
        value={data?.autoApproveThreshold || 0}
        onChange={e => handleChange("autoApproveThreshold", parseInt(e.target.value) || 0)}
        helperText='Set to 0 to disable auto-approval'
      />

      <div className='p-3 bg-orange-50 rounded-lg border border-orange-200'>
        <p className='text-xs text-orange-800'>
          <strong>Note:</strong> If auto-approve threshold is set, the approval will be automatically granted after the specified number of days if no action is taken.
        </p>
      </div>
    </div>
  );
};

export default ApprovalNodeForm;
