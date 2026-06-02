import { useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';

import { fileToDataUrl } from '../../lib/imageUpload';
import { cn } from '../../lib/utils';

type ImageUploadFieldProps = {
  label?: string;
  value?: string;
  onChange: (dataUrl: string) => void;
  className?: string;
};

export function ImageUploadField({ label = 'Image', value, onChange, className }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      onChange(dataUrl);
    } catch {
      setError('Could not process image. Try a smaller file.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <span className="text-sm font-medium text-vt-foreground">{label}</span>
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-vt-border bg-vt-surface-muted"
        >
          {value ? (
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <ImagePlus className="h-8 w-8 text-vt-muted" />
          )}
        </button>
        <div className="text-sm text-vt-muted">
          <p>Upload a photo from your device.</p>
          <p className="mt-1">{loading ? 'Processing…' : 'JPG or PNG recommended.'}</p>
          {error && <p className="mt-1 text-red-500">{error}</p>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}
