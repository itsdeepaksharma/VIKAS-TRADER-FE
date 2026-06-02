import { motion } from 'framer-motion';
import { Heart, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { FeatureChip } from '../components/ecommerce/FeatureChip';
import { GradientButton } from '../components/ecommerce/GradientButton';
import { PageHeader } from '../components/ecommerce/PageHeader';
import { useProduct } from '../hooks/useCatalog';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import { cn, formatCurrency } from '../lib/utils';

export function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.id ?? '');
      setSelectedSize(product.sizes[0] ?? '');
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-vt-muted">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p>Product not found.</p>
        <Link to="/" className="mt-4 text-vt-blue">
          Go Home
        </Link>
      </div>
    );
  }

  const wished = has(product.id);
  const outOfStock = !product.inStock;
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  function handleAddToCart() {
    if (!product || outOfStock) return;
    addItem(product, 1, { color: selectedColor, size: selectedSize });
    navigate('/cart');
  }

  return (
    <div className="flex min-h-0 flex-col">
      <PageHeader title="Product Details" />

      <div className="flex-1 pb-36 md:pb-8">
        <div className="md:grid md:grid-cols-2 md:items-start md:gap-8 lg:gap-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative aspect-square overflow-hidden rounded-3xl bg-vt-light-blue sm:rounded-4xl md:sticky md:top-4"
        >
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => toggle(product)}
            className="absolute right-4 top-4 rounded-full bg-vt-surface p-3 shadow-vt-card"
          >
            <Heart
              className={cn('h-5 w-5', wished ? 'fill-red-500 text-red-500' : 'text-vt-muted')}
            />
          </button>
        </motion.div>

        <div className="mt-5 min-w-0 md:mt-0">
          <h1 className="text-lg font-bold text-vt-foreground sm:text-xl lg:text-2xl">{product.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="text-2xl font-bold text-vt-blue">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <>
                <span className="text-vt-muted line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
                <span className="rounded-full bg-vt-gradient px-2 py-0.5 text-xs font-bold text-white">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold">{product.rating}</span>
            </div>
            <span className="text-sm text-vt-muted">({product.reviewCount} reviews)</span>
            <span
              className={cn(
                'ml-auto rounded-full px-3 py-1 text-xs font-semibold',
                product.inStock
                  ? 'bg-vt-light-blue text-vt-cyan-dark dark:text-vt-cyan'
                  : 'bg-red-100 text-red-600',
              )}
            >
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {product.features.map((f) => (
              <FeatureChip key={f} label={f} />
            ))}
          </div>

          {product.colors.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-semibold text-vt-foreground">Color</p>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.id)}
                    className={cn(
                      'h-10 w-10 rounded-full border-2 ring-offset-2',
                      selectedColor === c.id ? 'ring-2 ring-vt-blue' : 'border-vt-border',
                    )}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-vt-foreground">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      'rounded-xl border-2 px-4 py-2 text-sm font-medium transition-colors',
                      selectedSize === size
                        ? 'border-vt-blue bg-vt-light-blue text-vt-blue'
                        : 'border-vt-border text-vt-muted',
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="mt-5 text-sm leading-relaxed text-vt-muted">{product.description}</p>

          <div className="mt-6 hidden gap-3 md:flex">
            <GradientButton
              fullWidth
              className="flex-1"
              disabled={outOfStock}
              onClick={handleAddToCart}
            >
              {outOfStock ? 'Out of Stock' : 'Add to Cart'}
            </GradientButton>
            <GradientButton
              fullWidth
              className="flex-1 !bg-vt-navy"
              disabled={outOfStock}
              onClick={() => {
                if (outOfStock || !product) return;
                addItem(product, 1, { color: selectedColor, size: selectedSize });
                navigate('/checkout');
              }}
            >
              Buy Now
            </GradientButton>
          </div>
        </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-vt-border bg-vt-surface p-3 shadow-[0_-8px_32px_rgba(0,0,0,0.08)] sm:p-4 md:hidden">
        <div className="vt-container flex gap-2 sm:gap-3">
          <GradientButton
            fullWidth
            className="flex-1"
            disabled={outOfStock}
            onClick={handleAddToCart}
          >
            {outOfStock ? 'Out of Stock' : 'Add to Cart'}
          </GradientButton>
          <GradientButton
            fullWidth
            className="flex-1 !bg-vt-dark"
            disabled={outOfStock}
            onClick={() => {
              if (outOfStock || !product) return;
              addItem(product, 1, { color: selectedColor, size: selectedSize });
              navigate('/checkout');
            }}
          >
            Buy Now
          </GradientButton>
        </div>
      </div>
    </div>
  );
}
