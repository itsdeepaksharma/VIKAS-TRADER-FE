import { Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '../../lib/utils';
import { Input } from '../ui/input';

export type ProductColorOption = {
  id: string;
  name: string;
  hex: string;
};

type ProductColorsFieldProps = {
  value: ProductColorOption[];
  onChange: (colors: ProductColorOption[]) => void;
  className?: string;
};

function slugColorId(name: string) {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
  return slug || `color-${Date.now()}`;
}

export function ProductColorsField({ value, onChange, className }: ProductColorsFieldProps) {
  const [enabled, setEnabled] = useState(value.length > 0);
  const [draftName, setDraftName] = useState('');
  const [draftHex, setDraftHex] = useState('#00A3FF');

  useEffect(() => {
    if (value.length > 0) setEnabled(true);
  }, [value.length]);

  function toggleEnabled(checked: boolean) {
    setEnabled(checked);
    if (!checked) {
      onChange([]);
      setDraftName('');
    }
  }

  function addColor() {
    const name = draftName.trim();
    if (!name) return;

    const id = slugColorId(name);
    if (value.some((color) => color.id === id || color.name.toLowerCase() === name.toLowerCase())) {
      return;
    }

    onChange([...value, { id, name, hex: draftHex }]);
    setDraftName('');
  }

  function removeColor(id: string) {
    onChange(value.filter((color) => color.id !== id));
  }

  return (
    <div className={cn('space-y-3 sm:col-span-2', className)}>
      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => toggleEnabled(e.target.checked)}
          className="mt-1"
        />
        <span>
          <span className="block text-sm font-medium text-vt-foreground">This product has colors</span>
          <span className="block text-xs text-vt-muted">
            Leave unchecked if the product does not come in different colors.
          </span>
        </span>
      </label>

      {enabled && (
        <>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto] sm:items-end">
            <Input
              placeholder="Color name (e.g. Blue)"
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addColor();
                }
              }}
            />
            <label className="flex min-h-12 items-center gap-2 rounded-2xl border border-vt-border bg-vt-surface px-3">
              <span className="text-xs font-medium text-vt-muted">Pick</span>
              <input
                type="color"
                value={draftHex}
                onChange={(e) => setDraftHex(e.target.value)}
                className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent p-0"
                aria-label="Color swatch"
              />
            </label>
            <button
              type="button"
              onClick={addColor}
              disabled={!draftName.trim()}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-vt-border bg-vt-surface px-4 text-sm font-semibold text-vt-foreground transition-colors hover:bg-vt-surface-muted disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Add color
            </button>
          </div>

          {value.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {value.map((color) => (
                <span
                  key={color.id}
                  className="inline-flex items-center gap-2 rounded-full border border-vt-border bg-vt-surface px-3 py-1.5 text-sm font-medium text-vt-foreground"
                >
                  <span
                    className="h-4 w-4 rounded-full border border-vt-border"
                    style={{ backgroundColor: color.hex }}
                    aria-hidden
                  />
                  {color.name}
                  <button
                    type="button"
                    onClick={() => removeColor(color.id)}
                    className="rounded-full p-0.5 text-vt-muted hover:bg-vt-surface-muted hover:text-vt-foreground"
                    aria-label={`Remove ${color.name}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-vt-muted">Add at least one color option.</p>
          )}
        </>
      )}
    </div>
  );
}
