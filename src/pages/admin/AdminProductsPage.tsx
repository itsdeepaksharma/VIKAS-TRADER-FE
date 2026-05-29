import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  createProduct,
  deleteProduct,
  getAdminCategories,
  getAdminProducts,
  updateProduct,
  type ProductPayload,
} from '../../api/admin';
import { GradientButton } from '../../components/ecommerce/GradientButton';
import { Input } from '../../components/ui/input';
import { mapCategory, mapProduct } from '../../lib/catalogMappers';
import { formatCurrency } from '../../lib/utils';

const emptyProduct: ProductPayload = {
  category_id: '',
  name: '',
  description: '',
  price: 0,
  image: '',
  stock_quantity: 0,
  features: ['BPA Free'],
  colors: [],
  sizes: [],
  is_best_seller: false,
  is_active: true,
};

const LOW_STOCK_THRESHOLD = 5;

export function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const stockFilter = searchParams.get('stock');
  const [form, setForm] = useState<ProductPayload>(emptyProduct);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => (await getAdminCategories()).map(mapCategory),
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => (await getAdminProducts()).map(mapProduct),
  });

  const filteredProducts = useMemo(() => {
    if (stockFilter === 'out') {
      return products.filter((p) => !p.inStock || (p.stockQuantity ?? 0) <= 0);
    }
    if (stockFilter === 'low') {
      return products.filter((p) => {
        const qty = p.stockQuantity ?? 0;
        return qty > 0 && qty <= LOW_STOCK_THRESHOLD;
      });
    }
    return products;
  }, [products, stockFilter]);

  const pageTitle =
    stockFilter === 'out'
      ? 'Out of Stock'
      : stockFilter === 'low'
        ? 'Low Stock'
        : 'Products';

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) return updateProduct(editingId, form);
      return createProduct(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setForm(emptyProduct);
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  function startEdit(id: string) {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setEditingId(id);
    setForm({
      category_id: p.categoryId,
      name: p.name,
      description: p.description,
      price: p.price,
      original_price: p.originalPrice ?? null,
      image: p.image,
      stock_quantity: p.stockQuantity ?? 0,
      features: p.features,
      colors: p.colors,
      sizes: p.sizes,
      is_best_seller: p.isBestSeller ?? false,
      is_active: true,
    });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-vt-dark">{pageTitle}</h1>
        <p className="mt-1 text-sm text-slate-500">
          {stockFilter
            ? `Showing ${filteredProducts.length} matching product(s)`
            : 'Manage inventory, pricing, and stock levels'}
        </p>
      </div>

      <div className="mb-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
        <h2 className="mb-4 font-semibold text-vt-dark">
          {editingId ? 'Edit Product' : 'Add Product'}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            value={form.category_id}
            onChange={(e) => setForm({ ...form, category_id: e.target.value })}
          >
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <Input
            placeholder="Product name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Price"
            value={form.price || ''}
            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Stock quantity"
            value={form.stock_quantity ?? 0}
            onChange={(e) => setForm({ ...form, stock_quantity: Number(e.target.value) })}
          />
          <Input
            className="sm:col-span-2"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <Input
            className="sm:col-span-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_best_seller}
              onChange={(e) => setForm({ ...form, is_best_seller: e.target.checked })}
            />
            Best seller
          </label>
        </div>
        <div className="mt-4 flex gap-3">
          <GradientButton
            onClick={() => saveMutation.mutate()}
            disabled={
              saveMutation.isPending || !form.category_id || !form.name || !form.image || !form.price
            }
          >
            {editingId ? 'Update Product' : 'Add Product'}
          </GradientButton>
          {editingId && (
            <button
              type="button"
              className="text-sm text-slate-500"
              onClick={() => {
                setEditingId(null);
                setForm(emptyProduct);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-slate-100 bg-white shadow-card">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id} className="border-b border-slate-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3">{p.stockQuantity ?? 0}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        p.inStock ? 'text-emerald-600' : 'font-semibold text-red-600'
                      }
                    >
                      {p.inStock ? 'In stock' : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" className="text-vt-blue" onClick={() => startEdit(p.id)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-red-600"
                        onClick={() => {
                          if (confirm(`Delete "${p.name}"?`)) deleteMutation.mutate(p.id);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
