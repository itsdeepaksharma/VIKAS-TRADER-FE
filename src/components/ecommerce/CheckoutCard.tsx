import { MapPin, Pencil } from 'lucide-react';

import { Card, CardContent } from '../ui/card';
import { formatCurrency } from '../../lib/utils';

type CheckoutCardProps = {
  subtotal: number;
  shipping?: number;
};

export function CheckoutCard({ subtotal, shipping = 49 }: CheckoutCardProps) {
  const total = subtotal + shipping;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-vt-dark">Shipping Address</h3>
            <button type="button" className="text-sm font-medium text-vt-blue">
              Change
            </button>
          </div>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-vt-light-blue">
              <MapPin className="h-5 w-5 text-vt-blue" />
            </div>
            <div>
              <p className="font-medium text-vt-dark">Deepak Sharma</p>
              <p className="text-sm text-slate-500">
                42, Industrial Area, Phase 2
                <br />
                Ludhiana, Punjab — 141003
              </p>
              <p className="mt-1 text-sm text-slate-500">+91 98765 43210</p>
            </div>
            <Pencil className="ml-auto h-4 w-4 text-slate-400" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="mb-3 font-semibold text-vt-dark">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'FREE' : formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-bold text-vt-dark">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
