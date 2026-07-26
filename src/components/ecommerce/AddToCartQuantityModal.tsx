import { useEffect, useState } from 'react';

import { GradientButton } from './GradientButton';
import { QuantitySelector } from './QuantitySelector';
import type { Product } from '../../types/product';
import { formatCurrency } from '../../lib/utils';

type AddToCartQuantityModalProps = {
  open: boolean;
  product: Product | null;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
};

export function AddToCartQuantityModal({
  open,
  product,
  confirmLabel = 'Add to Cart',
  onClose,
  onConfirm,
}: AddToCartQuantityModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open && product) {
      setQuantity(1);
      setError('');
    }
  }, [open, product]);

  if (!open || !product) return null;

  const maxQuantity = Math.max(1, product.stockQuantity ?? 99);

  function handleConfirm() {
    if (quantity < 1) {
      setError('Please select a quantity.');
      return;
    }
    if (quantity > maxQuantity) {
      setError(`Only ${maxQuantity} available in stock.`);
      return;
    }
    onConfirm(quantity);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-vt-dark/40 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-sm rounded-t-3xl border border-vt-border bg-vt-surface p-5 shadow-elevated sm:rounded-3xl"
        role="dialog"
        aria-modal="true"
      >
        <p className="text-lg font-bold text-vt-foreground">Choose quantity</p>
        <p className="mt-1 line-clamp-2 text-sm text-vt-muted">{product.name}</p>
        <p className="mt-2 text-xl font-bold text-vt-blue">{formatCurrency(product.price)}</p>

        <div className="mt-5 flex justify-center">
          <QuantitySelector value={quantity} min={1} max={maxQuantity} onChange={setQuantity} />
        </div>

        {error && <p className="mt-3 text-center text-sm text-red-500">{error}</p>}

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-2xl border border-vt-border py-3 text-sm font-semibold text-vt-foreground"
          >
            Cancel
          </button>
          <GradientButton type="button" className="flex-1" onClick={handleConfirm}>
            {confirmLabel}
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
