import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CheckoutCard } from '../components/ecommerce/CheckoutCard';
import { GradientButton } from '../components/ecommerce/GradientButton';
import { PageHeader } from '../components/ecommerce/PageHeader';
import { StepIndicator } from '../components/ecommerce/StepIndicator';
import { useCreateOrder } from '../hooks/useOrders';
import { useCartStore } from '../store/cartStore';

export function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);
  const [error, setError] = useState('');
  const createOrder = useCreateOrder();

  async function handlePlaceOrder() {
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    const outOfStock = items.some((i) => !i.product.inStock);
    if (outOfStock) {
      setError('Remove out-of-stock items before checkout.');
      return;
    }
    setError('');
    try {
      await createOrder.mutateAsync({
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
      });
      clearCart();
      navigate('/orders');
    } catch {
      setError('Could not place order. Check stock and try again.');
    }
  }

  return (
    <div className="vt-page pb-28">
      <PageHeader title="Checkout" />
      <div className="vt-page-body-narrow space-y-6">
        <StepIndicator currentStep={1} />

        <CheckoutCard subtotal={subtotal} />

        <p className="rounded-2xl bg-vt-light-blue/50 p-4 text-sm text-vt-muted">
          Review your cart and tap <strong>Place Order</strong> to confirm. Payment collection is
          not required at this stage.
        </p>

        {error && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-vt-border bg-vt-surface/95 backdrop-blur-md">
        <div className="vt-container py-4">
          <GradientButton
            fullWidth
            size="lg"
            disabled={createOrder.isPending}
            onClick={handlePlaceOrder}
          >
            {createOrder.isPending ? 'Placing Order...' : 'Place Order'}
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
