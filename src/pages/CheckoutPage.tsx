import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getApiErrorMessage } from '../api/client';
import { CartStockAlerts } from '../components/ecommerce/CartStockAlerts';
import { CheckoutCard } from '../components/ecommerce/CheckoutCard';
import { GradientButton } from '../components/ecommerce/GradientButton';
import { PageHeader } from '../components/ecommerce/PageHeader';
import { StepIndicator } from '../components/ecommerce/StepIndicator';
import { useCartStockSync } from '../hooks/useCartStockSync';
import { useCreateOrder } from '../hooks/useOrders';
import { resolveColorLabel } from '../lib/cartVariants';
import { useCartStore } from '../store/cartStore';

export function CheckoutPage() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore((s) => s.subtotal());
  const clearCart = useCartStore((s) => s.clearCart);
  const [error, setError] = useState('');
  const { issues, syncing, syncCartStock } = useCartStockSync();
  const createOrder = useCreateOrder();

  useEffect(() => {
    void syncCartStock();
  }, [syncCartStock]);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [items.length, navigate]);

  async function handlePlaceOrder() {
    setError('');
    const stockCheck = await syncCartStock();
    const latestItems = useCartStore.getState().items;

    if (latestItems.length === 0) {
      setError('Your cart is empty. Add in-stock items to place an order.');
      return;
    }

    if (!stockCheck.canCheckout) {
      setError('Some items are out of stock or unavailable. Your cart has been updated.');
      return;
    }

    try {
      await createOrder.mutateAsync({
        items: latestItems.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          selected_color: resolveColorLabel(i.product, i.selectedColor) ?? null,
          selected_size: i.selectedSize ?? null,
        })),
      });
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Could not place order. Please try again.'));
      await syncCartStock();
    }
  }

  const canPlaceOrder = items.length > 0 && !syncing && !createOrder.isPending;

  return (
    <div className="min-h-screen bg-vt-surface-muted pb-40">
      <PageHeader title="Checkout" />
      <div className="space-y-6 px-4 py-4">
        <StepIndicator currentStep={1} />

        <CheckoutCard items={items} subtotal={subtotal} />

        <CartStockAlerts issues={issues} syncing={syncing} />

        <p className="rounded-2xl bg-vt-light-blue/50 p-4 text-sm text-vt-muted">
          Review your cart and tap <strong>Place Order</strong> to confirm. Stock is checked in
          real time before your order is placed.
        </p>

        {error && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-600">{error}</p>}
      </div>

      <div className="fixed inset-x-0 bottom-20 z-40 border-t border-vt-border bg-vt-surface/95 px-4 py-3 backdrop-blur-sm">
        <div className="flex justify-center">
          <GradientButton
            size="default"
            className="min-w-[11rem] px-8"
            disabled={!canPlaceOrder}
            onClick={handlePlaceOrder}
          >
            {createOrder.isPending
              ? 'Placing Order...'
              : syncing
                ? 'Checking Stock...'
                : 'Place Order'}
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
