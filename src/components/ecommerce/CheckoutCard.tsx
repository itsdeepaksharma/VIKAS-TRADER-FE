import { MapPin, Pencil } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Card, CardContent } from '../ui/card';
import { formatCurrency } from '../../lib/utils';
import { useAuthStore } from '../../store/authStore';

type CheckoutCardProps = {
  subtotal: number;
};

export function CheckoutCard({ subtotal }: CheckoutCardProps) {
  const user = useAuthStore((s) => s.user);
  const hasAddress = Boolean(user?.name?.trim() || user?.address?.trim());

  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-semibold text-vt-foreground">Shipping Address</h3>
            <Link to="/profile/address" className="text-sm font-medium text-vt-blue">
              {hasAddress ? 'Change' : 'Add'}
            </Link>
          </div>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-vt-light-blue">
              <MapPin className="h-5 w-5 text-vt-blue" />
            </div>
            <div className="min-w-0 flex-1">
              {hasAddress ? (
                <>
                  <p className="font-medium text-vt-foreground">{user?.name}</p>
                  {user?.address ? (
                    <p className="whitespace-pre-line text-sm text-vt-muted">{user.address}</p>
                  ) : null}
                  {user?.mobile ? (
                    <p className="mt-1 text-sm text-vt-muted">{user.mobile}</p>
                  ) : null}
                </>
              ) : (
                <p className="text-sm text-vt-muted">
                  No shipping address on file.{' '}
                  <Link to="/profile/address" className="font-medium text-vt-blue hover:underline">
                    Add your address
                  </Link>{' '}
                  before placing an order.
                </p>
              )}
            </div>
            {hasAddress ? <Pencil className="ml-auto h-4 w-4 shrink-0 text-vt-muted" /> : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="mb-3 font-semibold text-vt-foreground">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-t border-vt-border pt-2 text-base font-bold text-vt-foreground">
              <span>Total</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
