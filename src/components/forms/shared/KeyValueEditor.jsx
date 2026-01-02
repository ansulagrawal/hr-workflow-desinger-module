import { Plus, Trash2 } from "lucide-react";
import { nanoid } from "nanoid";
import { cn } from "../../../utils/cn";
import { Button, Input } from "../../ui";

/**
 * KeyValueEditor - Reusable component for editing key-value pairs
 */
const KeyValueEditor = ({ label, items = [], onChange, keyPlaceholder = "Key", valuePlaceholder = "Value", className }) => {
  const handleAdd = () => {
    onChange([...items, { id: nanoid(6), key: "", value: "" }]);
  };

  const handleRemove = id => {
    onChange(items.filter(item => item.id !== id));
  };

  const handleChange = (id, field, value) => {
    onChange(items.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <label className='block text-sm font-medium text-gray-700'>{label}</label>}

      {items.length === 0 ? (
        <p className='text-sm text-gray-500 italic py-2'>No items added</p>
      ) : (
        <div className='space-y-2'>
          {items.map((item, index) => (
            <div key={item.id || index} className='flex items-center gap-2'>
              <Input placeholder={keyPlaceholder} value={item.key} onChange={e => handleChange(item.id || index, "key", e.target.value)} className='flex-1' />
              <Input placeholder={valuePlaceholder} value={item.value} onChange={e => handleChange(item.id || index, "value", e.target.value)} className='flex-1' />
              <Button variant='ghost' size='icon' onClick={() => handleRemove(item.id || index)} className='text-gray-400 hover:text-red-500 shrink-0'>
                <Trash2 className='w-4 h-4' />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button variant='outline' size='sm' onClick={handleAdd} className='w-full mt-2'>
        <Plus className='w-4 h-4 mr-1' />
        Add Item
      </Button>
    </div>
  );
};

export default KeyValueEditor;
