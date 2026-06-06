import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';

import { fileToDataUrl } from '../../lib/imageUpload';
import { cn } from '../../lib/utils';

const MAX_IMAGES = 8;

type MultiImageUploadFieldProps = {
  label?: string;
  value: string[];
  onChange: (images: string[]) => void;
  className?: string;
  maxImages?: number;
};

export function MultiImageUploadField({
  label = 'Product photos',
  value,
  onChange,
  className,
  maxImages = MAX_IMAGES,
}: MultiImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const canAddMore = value.length < maxImages;

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    const imageFiles = Array.from(files).filter((file) => file.type.startsWith('image/'));
    if (!imageFiles.length) {
      setError('Please choose image files only.');
      return;
    }

    const remaining = maxImages - value.length;
    if (remaining <= 0) {
      setError(`You can upload up to ${maxImages} photos.`);
      return;
    }

    setError('');
    setLoading(true);
    try {
      const selected = imageFiles.slice(0, remaining);
      const dataUrls = await Promise.all(selected.map((file) => fileToDataUrl(file)));
      onChange([...value, ...dataUrls]);
    } catch {
      setError('Could not process one or more images. Try smaller files.');
    } finally {
      setLoading(false);
    }
  }

  function removeImage(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-vt-foreground">{label}</span>
        <span className="text-xs text-vt-muted">
          {value.length}/{maxImages}
        </span>
      </div>

      <div className="flex flex-wrap gap-3">
        {value.map((image, index) => (
          <div key={`${index}-${image.slice(0, 24)}`} className="relative">
            <img
              src={image}
              alt=""
              className="h-24 w-24 rounded-2xl border border-vt-border object-cover"
            />
            {index === 0 && (
              <span className="absolute left-2 top-2 rounded-full bg-vt-gradient px-2 py-0.5 text-[10px] font-bold text-white">
                Cover
              </span>
            )}
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-vt-card"
              aria-label="Remove photo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        {canAddMore && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-dashed border-vt-border bg-vt-surface-muted"
          >
            <ImagePlus className="h-8 w-8 text-vt-muted" />
          </button>
        )}
      </div>

      <div className="text-sm text-vt-muted">
        <p>Upload multiple photos from your device. The first photo is used as the cover image.</p>
        <p className="mt-1">{loading ? 'Processing…' : 'JPG or PNG recommended.'}</p>
        {error && <p className="mt-1 text-red-500">{error}</p>}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          void handleFiles(e.target.files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
