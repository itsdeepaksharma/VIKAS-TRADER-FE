import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
  type CategoryPayload,
} from '../../api/admin';
import { GradientButton } from '../../components/ecommerce/GradientButton';
import { Input } from '../../components/ui/input';
import { mapCategory } from '../../lib/catalogMappers';

const emptyForm: CategoryPayload = {
  slug: '',
  name: '',
  image: '',
  bg_color: 'bg-vt-light-blue',
  sort_order: 0,
  is_active: true,
};

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<CategoryPayload>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => (await getAdminCategories()).map(mapCategory),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editingId) {
        return updateCategory(editingId, form);
      }
      return createCategory(form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setForm(emptyForm);
      setEditingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  function startEdit(id: string) {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    setEditingId(id);
    setForm({
      slug: cat.slug,
      name: cat.name,
      image: cat.image,
      bg_color: cat.bgColor,
      is_active: true,
    });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-vt-dark">Categories</h1>
        <p className="mt-1 text-sm text-slate-500">Add, edit, or remove store categories</p>
      </div>

      <div className="mb-8 rounded-3xl border border-slate-100 bg-white p-6 shadow-card">
        <h2 className="mb-4 font-semibold text-vt-dark">
          {editingId ? 'Edit Category' : 'Add Category'}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            placeholder="Slug (e.g. containers)"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            className="sm:col-span-2"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
          <Input
            placeholder="Tailwind bg class (e.g. bg-vt-light-blue)"
            value={form.bg_color}
            onChange={(e) => setForm({ ...form, bg_color: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Sort order"
            value={form.sort_order ?? 0}
            onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
          />
        </div>
        <div className="mt-4 flex gap-3">
          <GradientButton
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending || !form.slug || !form.name || !form.image}
          >
            {editingId ? 'Update' : 'Add Category'}
          </GradientButton>
          {editingId && (
            <button
              type="button"
              className="text-sm text-slate-500"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
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
        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Items</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-slate-50">
                  <td className="px-4 py-3 font-medium">{cat.name}</td>
                  <td className="px-4 py-3 text-slate-600">{cat.slug}</td>
                  <td className="px-4 py-3">{cat.itemCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="text-vt-blue"
                        onClick={() => startEdit(cat.id)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-red-600"
                        onClick={() => {
                          if (confirm(`Delete category "${cat.name}"?`)) {
                            deleteMutation.mutate(cat.id);
                          }
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
