import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronRight, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  createProduct,
  deleteProduct,
  getAdminCategories,
  getAdminProducts,
  updateProduct,
  type ProductPayload,
} from '../../api/admin';
import { getApiErrorMessage } from '../../api/client';
import { AdminEditDeleteActions } from '../../components/admin/AdminEditDeleteActions';
import { AdminModal } from '../../components/admin/AdminModal';
import { AdminPagination } from '../../components/admin/AdminPagination';
import { AdminModalFooter } from '../../components/admin/AdminModalFooter';
import { ResponsiveTable } from '../../components/admin/ResponsiveTable';
import { MultiImageUploadField } from '../../components/admin/MultiImageUploadField';
import { ProductColorsField } from '../../components/admin/ProductColorsField';
import { ProductUnitsField } from '../../components/admin/ProductUnitsField';
import { GradientButton } from '../../components/ecommerce/GradientButton';
import { Input } from '../../components/ui/input';
import { mapCategory, mapProduct } from '../../lib/catalogMappers';
import { getProductImages } from '../../lib/productImages';
import { DEFAULT_PRODUCT_IMAGE } from '../../lib/imageUpload';
import { buildProductImagePayload } from '../../lib/productImages';
import { isLowStock, isOutOfStock } from '../../lib/stockStatus';
import { cn, formatCurrency } from '../../lib/utils';
import type { Product } from '../../types/product';

const PAGE_SIZE = 10;

const emptyProduct: ProductPayload = {
  category_id: '',
  name: '',
  description: '',
  price: 0,
  image: '',
  images: [],
  stock_quantity: 0,
  features: [],
  colors: [],
  sizes: [],
  is_best_seller: false,
  is_active: true,
};

function nonNegativeNumber(value: string): number {
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  return parsed;
}

function nonNegativeInt(value: string): number {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 0) return 0;
  return parsed;
}

export function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const stockFilter = searchParams.get('stock');
  const canAddProduct = !stockFilter;
  const addSectionRef = useRef<HTMLDivElement>(null);

  const [showAddPanel, setShowAddPanel] = useState(() => {
    const add = searchParams.get('add');
    return add === '1' || add === 'true';
  });
  const [form, setForm] = useState<ProductPayload>(emptyProduct);
  const [error, setError] = useState('');
  const [modal, setModal] = useState<'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<ProductPayload>(emptyProduct);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  const { data: categories = [] } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => (await getAdminCategories()).map(mapCategory),
  });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => (await getAdminProducts()).map(mapProduct),
  });

  const categoryNameById = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category.name])),
    [categories],
  );

  const filteredProducts = useMemo(() => {
    let list = products;

    if (stockFilter === 'out') {
      list = list.filter((product) => isOutOfStock(product.stockQuantity ?? 0));
    } else if (stockFilter === 'low') {
      list = list.filter((product) => isLowStock(product.stockQuantity ?? 0));
    }

    const query = searchQuery.trim().toLowerCase();
    if (!query) return list;

    return list.filter((product) => {
      const categoryName = categoryNameById[product.categoryId]?.toLowerCase() ?? '';
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        categoryName.includes(query)
      );
    });
  }, [products, stockFilter, searchQuery, categoryNameById]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  const paginatedProducts = useMemo(() => {
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, stockFilter]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageTitle =
    stockFilter === 'out' ? 'Out of Stock' : stockFilter === 'low' ? 'Low Stock' : 'Products';

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    queryClient.invalidateQueries({ queryKey: ['products'] });
    queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
  };

  const createMutation = useMutation({
    mutationFn: () => {
      const imagePayload = buildProductImagePayload(form.images ?? [], DEFAULT_PRODUCT_IMAGE);
      return createProduct({
        ...form,
        ...imagePayload,
        description: form.description || form.name,
      });
    },
    onSuccess: () => {
      invalidate();
      setForm(emptyProduct);
      setError('');
      setShowAddPanel(false);
      const next = new URLSearchParams(searchParams);
      next.delete('add');
      setSearchParams(next, { replace: true });
    },
    onError: (err) => setError(getApiErrorMessage(err, 'Could not add product.')),
  });

  const updateMutation = useMutation({
    mutationFn: () => {
      const imagePayload = buildProductImagePayload(
        editForm.images ?? [],
        editForm.image || DEFAULT_PRODUCT_IMAGE,
      );
      return updateProduct(selected!.id, {
        ...editForm,
        ...imagePayload,
      });
    },
    onSuccess: () => {
      invalidate();
      closeModal();
    },
    onError: (err) => setError(getApiErrorMessage(err, 'Could not update product.')),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteProduct(selected!.id),
    onSuccess: () => {
      invalidate();
      closeModal();
    },
    onError: (err) => setError(getApiErrorMessage(err, 'Could not delete product.')),
  });

  function openEdit(product: Product) {
    const images = getProductImages(product);
    setSelected(product);
    setEditForm({
      category_id: product.categoryId,
      name: product.name,
      description: product.description,
      price: product.price,
      original_price: product.originalPrice ?? null,
      image: images[0] ?? product.image,
      images,
      stock_quantity: product.stockQuantity ?? 0,
      features: product.features,
      colors: product.colors,
      sizes: product.sizes,
      is_best_seller: product.isBestSeller ?? false,
      is_active: true,
    });
    setError('');
    setModal('edit');
  }

  function openDelete(product: Product) {
    setSelected(product);
    setError('');
    setModal('delete');
  }

  function closeModal() {
    setModal(null);
    setSelected(null);
    setError('');
  }

  const canSubmitAdd =
    Boolean(form.category_id) && Boolean(form.name.trim()) && Number(form.price) > 0;

  useEffect(() => {
    const add = searchParams.get('add');
    if (add === '1' || add === 'true') {
      setShowAddPanel(true);
    }
  }, [searchParams]);

  function openAddPanel() {
    setShowAddPanel(true);
    const next = new URLSearchParams(searchParams);
    next.set('add', '1');
    setSearchParams(next, { replace: true });
    requestAnimationFrame(() => {
      addSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function closeAddPanel() {
    setShowAddPanel(false);
    const next = new URLSearchParams(searchParams);
    next.delete('add');
    setSearchParams(next, { replace: true });
  }

  return (
    <div>
      <div className="mb-6 hidden sm:mb-8 lg:block">
        <h1 className="vt-page-title">{pageTitle}</h1>
        <p className="vt-page-desc">
          {searchQuery.trim()
            ? `${filteredProducts.length} product(s) matching "${searchQuery.trim()}"`
            : stockFilter
              ? `Showing ${filteredProducts.length} matching product(s)`
              : 'Manage inventory, pricing, and stock levels'}
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 border-b border-vt-border pb-4 sm:flex-row sm:items-center sm:justify-between">
        {canAddProduct ? (
          <button
            type="button"
            onClick={() => (showAddPanel ? closeAddPanel() : openAddPanel())}
            className={cn(
              'inline-flex items-center gap-2 rounded-full bg-vt-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all',
              'hover:scale-[1.02] hover:shadow-elevated active:scale-[0.98]',
              showAddPanel && 'ring-2 ring-vt-blue/40',
            )}
            aria-expanded={showAddPanel}
            aria-controls="add-product-panel"
          >
            Add Product
            <ChevronRight
              className={cn('h-4 w-4 transition-transform duration-200', showAddPanel && 'rotate-90')}
              aria-hidden
            />
          </button>
        ) : (
          <div />
        )}

        <div className="relative w-full sm:max-w-sm sm:shrink-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-vt-muted" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="h-11 rounded-2xl pl-10"
            aria-label="Search products"
          />
        </div>
      </div>

      {canAddProduct && showAddPanel && (
        <div
          id="add-product-panel"
          ref={addSectionRef}
          className="vt-card-panel mb-6 sm:mb-8"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-semibold text-vt-foreground">Add Product</h2>
            <button
              type="button"
              onClick={closeAddPanel}
              className="text-sm font-medium text-vt-muted hover:text-vt-foreground"
            >
              Close
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              className="rounded-xl border border-vt-border px-3 py-2 text-sm"
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
              min={0}
              step="0.01"
              placeholder="Price"
              value={form.price || ''}
              onChange={(e) => setForm({ ...form, price: nonNegativeNumber(e.target.value) })}
            />
            <ProductUnitsField
              compact
              value={form.sizes ?? []}
              onChange={(sizes) => setForm({ ...form, sizes })}
            />
            <Input
              type="number"
              min={0}
              step={1}
              placeholder="Stock quantity"
              value={form.stock_quantity ?? 0}
              onChange={(e) =>
                setForm({ ...form, stock_quantity: nonNegativeInt(e.target.value) })
              }
            />
            <div className="sm:col-span-2">
              <MultiImageUploadField
                value={form.images ?? []}
                onChange={(images) => setForm({ ...form, images, image: images[0] ?? '' })}
              />
            </div>
            <Input
              className="sm:col-span-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <ProductColorsField
              value={form.colors ?? []}
              onChange={(colors) => setForm({ ...form, colors })}
            />
            <label className="flex items-center gap-2 text-sm sm:col-span-2">
              <input
                type="checkbox"
                checked={form.is_best_seller}
                onChange={(e) => setForm({ ...form, is_best_seller: e.target.checked })}
              />
              Best seller
            </label>
          </div>
          {error && !modal && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <div className="mt-4">
            <GradientButton
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !canSubmitAdd}
            >
              {createMutation.isPending ? 'Adding…' : 'Add Product'}
            </GradientButton>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-vt-muted">Loading...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="rounded-3xl bg-vt-surface p-8 text-center text-vt-muted shadow-vt-card">
          {searchQuery.trim()
            ? `No products found for "${searchQuery.trim()}".`
            : 'No products match this filter.'}
        </p>
      ) : (
        <>
          <ResponsiveTable minWidth="720px">
            <thead className="border-b border-vt-border bg-vt-surface-muted text-vt-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((p) => (
                <tr key={p.id} className="border-b border-vt-border">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover bg-vt-surface-muted"
                      />
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatCurrency(p.price)}</td>
                  <td className="px-4 py-3">{p.stockQuantity ?? 0}</td>
                  <td className="px-4 py-3">
                    <span className={p.inStock ? 'text-vt-blue' : 'font-semibold text-red-600'}>
                      {p.inStock ? 'In stock' : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <AdminEditDeleteActions
                      onEdit={() => openEdit(p)}
                      onDelete={() => openDelete(p)}
                      editLabel={`Edit ${p.name}`}
                      deleteLabel={`Delete ${p.name}`}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
        </ResponsiveTable>

        <AdminPagination
          className="mt-4"
          page={page}
          pageSize={PAGE_SIZE}
          totalItems={filteredProducts.length}
          onPageChange={setPage}
        />
        </>
      )}

      <AdminModal open={modal === 'edit'} title="Edit Product" onClose={closeModal}>
        <div className="grid gap-3 sm:grid-cols-2">
          <select
            className="rounded-xl border border-vt-border px-3 py-2 text-sm sm:col-span-2"
            value={editForm.category_id}
            onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })}
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
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
          <Input
            type="number"
            min={0}
            step="0.01"
            placeholder="Price"
            value={editForm.price || ''}
            onChange={(e) => setEditForm({ ...editForm, price: nonNegativeNumber(e.target.value) })}
          />
          <ProductUnitsField
            compact
            value={editForm.sizes ?? []}
            onChange={(sizes) => setEditForm({ ...editForm, sizes })}
          />
          <Input
            type="number"
            min={0}
            step={1}
            placeholder="Stock"
            value={editForm.stock_quantity ?? 0}
            onChange={(e) =>
              setEditForm({ ...editForm, stock_quantity: nonNegativeInt(e.target.value) })
            }
          />
          <div className="sm:col-span-2">
            <MultiImageUploadField
              value={editForm.images ?? []}
              onChange={(images) => setEditForm({ ...editForm, images, image: images[0] ?? '' })}
            />
          </div>
          <Input
            className="sm:col-span-2"
            placeholder="Description"
            value={editForm.description}
            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
          />
          <ProductColorsField
            value={editForm.colors ?? []}
            onChange={(colors) => setEditForm({ ...editForm, colors })}
          />
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={editForm.is_best_seller}
              onChange={(e) => setEditForm({ ...editForm, is_best_seller: e.target.checked })}
            />
            Best seller
          </label>
        </div>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
        <AdminModalFooter>
          <GradientButton
            size="sm"
            onClick={() => updateMutation.mutate()}
            disabled={
              updateMutation.isPending ||
              !editForm.category_id ||
              !editForm.name.trim() ||
              !editForm.price
            }
          >
            {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
          </GradientButton>
        </AdminModalFooter>
      </AdminModal>

      <AdminModal open={modal === 'delete'} title="Delete Product" onClose={closeModal}>
        <p className="text-sm text-vt-muted">
          Delete <strong>{selected?.name}</strong>? This cannot be undone.
        </p>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <AdminModalFooter>
          <GradientButton
            size="sm"
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="!from-red-500 !to-red-600"
          >
            {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
          </GradientButton>
          <button
            type="button"
            className="min-h-9 rounded-xl px-5 py-2 text-sm font-medium text-vt-muted transition-colors hover:bg-vt-surface-hover hover:text-vt-foreground"
            onClick={closeModal}
          >
            Cancel
          </button>
        </AdminModalFooter>
      </AdminModal>
    </div>
  );
}
