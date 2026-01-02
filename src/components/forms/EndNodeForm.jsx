import { Input, Toggle } from "../ui";

/**
 * EndNodeForm - Configuration form for End nodes
 */
const EndNodeForm = ({ data, onChange }) => {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className='space-y-4'>
      <Input label='Completion Message' value={data?.message || ""} onChange={e => handleChange("message", e.target.value)} placeholder='Enter completion message' />

      <Toggle label='Show Summary' checked={data?.showSummary || false} onChange={checked => handleChange("showSummary", checked)} />

      <p className='text-xs text-gray-500'>When enabled, a summary of all completed steps will be displayed when the workflow reaches this end point.</p>

      <div className='p-3 bg-red-50 rounded-lg border border-red-200'>
        <p className='text-xs text-red-800'>
          <strong>End Node:</strong> This marks the completion of a workflow path. No further actions can be connected after this node.
        </p>
      </div>
    </div>
  );
};

export default EndNodeForm;
