import React, { useEffect, useState } from "react";
import { Input, Select, Textarea } from "../ui";
import { fetchAutomations } from "../../services/api";
import { Loader2 } from "lucide-react";

/**
 * AutomatedNodeForm - Configuration form for Automated nodes
 * Dynamically renders parameter fields based on selected action
 */
const AutomatedNodeForm = ({ data, onChange }) => {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAutomations = async () => {
      try {
        const result = await fetchAutomations();
        setAutomations(result);
      } catch (error) {
        console.error("Failed to load automations:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAutomations();
  }, []);

  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const handleActionChange = actionId => {
    // Reset parameters when action changes
    onChange({
      ...data,
      actionId: actionId,
      parameters: {},
    });
  };

  const handleParameterChange = (paramName, value) => {
    onChange({
      ...data,
      parameters: {
        ...data?.parameters,
        [paramName]: value,
      },
    });
  };

  const selectedAction = automations.find(a => a.id === data?.actionId);

  if (loading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <Loader2 className='w-6 h-6 animate-spin text-gray-400' />
        <span className='ml-2 text-gray-500'>Loading automations...</span>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <Input label='Title' required value={data?.title || ""} onChange={e => handleChange("title", e.target.value)} placeholder='Enter step title' />

      <Select
        label='Action'
        required
        value={data?.actionId || ""}
        onChange={e => handleActionChange(e.target.value)}
        options={automations.map(a => ({ value: a.id, label: a.label }))}
        placeholder='Select an action'
      />

      {selectedAction && (
        <>
          <p className='text-xs text-gray-500 -mt-2'>{selectedAction.description}</p>

          <div className='border-t pt-4 mt-4'>
            <h4 className='text-sm font-medium text-gray-700 mb-3'>Parameters</h4>
            <div className='space-y-3'>
              {selectedAction.params.map(param => {
                if (param.type === "select") {
                  return (
                    <Select
                      key={param.name}
                      label={param.label}
                      required={param.required}
                      value={data?.parameters?.[param.name] || ""}
                      onChange={e => handleParameterChange(param.name, e.target.value)}
                      options={param.options || []}
                      placeholder={`Select ${param.label.toLowerCase()}`}
                    />
                  );
                }

                if (param.type === "textarea") {
                  return (
                    <Textarea
                      key={param.name}
                      label={param.label}
                      required={param.required}
                      value={data?.parameters?.[param.name] || ""}
                      onChange={e => handleParameterChange(param.name, e.target.value)}
                      placeholder={`Enter ${param.label.toLowerCase()}`}
                      rows={3}
                    />
                  );
                }

                if (param.type === "number") {
                  return (
                    <Input
                      key={param.name}
                      type='number'
                      label={param.label}
                      required={param.required}
                      value={data?.parameters?.[param.name] || ""}
                      onChange={e => handleParameterChange(param.name, e.target.value)}
                      placeholder={`Enter ${param.label.toLowerCase()}`}
                    />
                  );
                }

                return (
                  <Input
                    key={param.name}
                    label={param.label}
                    required={param.required}
                    value={data?.parameters?.[param.name] || ""}
                    onChange={e => handleParameterChange(param.name, e.target.value)}
                    placeholder={`Enter ${param.label.toLowerCase()}`}
                  />
                );
              })}
            </div>
          </div>
        </>
      )}

      {!selectedAction && data?.actionId && <p className='text-sm text-red-500'>Selected action not found. Please select a valid action.</p>}
    </div>
  );
};

export default AutomatedNodeForm;
