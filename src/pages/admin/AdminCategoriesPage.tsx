import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';

import {
  createCategory,
  deleteCategory,
  getAdminCategories,
  updateCategory,
} from '../../api/admin';
import { getApiErrorMessage } from '../../api/client';
import { AdminModal } from '../../components/admin/AdminModal';
import { ResponsiveTable } from '../../components/admin/ResponsiveTable';
import { AdminModalFooter } from '../../components/admin/AdminModalFooter';
import { ImageUploadField } from '../../components/admin/ImageUploadField';
import { GradientButton } from '../../components/ecommerce/GradientButton';
import { Input } from '../../components/ui/input';
import { DEFAULT_CATEGORY_IMAGE } from '../../lib/imageUpload';
import { mapCategory } from '../../lib/catalogMappers';
import { slugify } from '../../lib/slugify';
import { cn } from '../../lib/utils';
import type { Category } from '../../types/product';

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const addSectionRef = useRef<HTMLDivElement>(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');
  const [modal, setModal] = useState<'edit' | 'delete' | null>(null);
  const [selected, setSelected] = useState<Category | null>(null);
  const [editName, setEditName] = useState('');
  const [editImage, setEditImage] = useState('');

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => (await getAdminCategories()).map(mapCategory),
  });

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  };

  const createMutation = useMutation({
    mutationFn: () =>
      createCategory({
        name: name.trim(),
        slug: slugify(name),
        image: image || DEFAULT_CATEGORY_IMAGE,
      }),
    onSuccess: () => {
      invalidate();
      setName('');
      setImage('');
      setError('');
      setShowAddPanel(false);
    },
    onError: (err) => setError(getApiErrorMessage(err, 'Could not add category.')),
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      updateCategory(selected!.id, {
        name: editName.trim(),
        slug: slugify(editName),
        image: editImage || DEFAULT_CATEGORY_IMAGE,
      }),
    onSuccess: () => {
      invalidate();
      closeModal();
    },
    onError: (err) => setError(getApiErrorMessage(err, 'Could not update category.')),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteCategory(selected!.id),
    onSuccess: () => {
      invalidate();
      closeModal();
    },
    onError: (err) => setError(getApiErrorMessage(err, 'Could not delete category.')),
  });

  function openEdit(cat: Category) {
    setSelected(cat);
    setEditName(cat.name);
    setEditImage(cat.image);
    setError('');
    setModal('edit');
  }

  function openDelete(cat: Category) {
    setSelected(cat);
    setError('');
    setModal('delete');
  }

  function closeModal() {
    setModal(null);
    setSelected(null);
    setError('');
  }

  function openAddPanel() {
    setShowAddPanel(true);
    requestAnimationFrame(() => {
      addSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function closeAddPanel() {
    setShowAddPanel(false);
  }

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="vt-page-title">Categories</h1>
        <p className="vt-page-desc">
          Add categories here. Item counts update automatically when products are assigned.
        </p>
      </div>

      <div className="mb-4 flex items-center gap-2 border-b border-vt-border pb-4">
        <button
          type="button"
          onClick={() => (showAddPanel ? closeAddPanel() : openAddPanel())}
          className={cn(
            'inline-flex items-center gap-2 rounded-full bg-vt-gradient px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-all',
            'hover:scale-[1.02] hover:shadow-elevated active:scale-[0.98]',
            showAddPanel && 'ring-2 ring-vt-blue/40',
          )}
          aria-expanded={showAddPanel}
          aria-controls="add-category-panel"
        >
          Add Category
          <ChevronRight
            className={cn('h-4 w-4 transition-transform duration-200', showAddPanel && 'rotate-90')}
            aria-hidden
          />
        </button>
      </div>

      {showAddPanel && (
        <div id="add-category-panel" ref={addSectionRef} className="vt-card-panel mb-6 sm:mb-8">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-semibold text-vt-foreground">Add Category</h2>
            <button
              type="button"
              onClick={closeAddPanel}
              className="text-sm font-medium text-vt-muted hover:text-vt-foreground"
            >
              Close
            </button>
          </div>
          <div className="space-y-4">
            <Input
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <ImageUploadField label="Category image (optional)" value={image} onChange={setImage} />
            {error && !modal && <p className="text-sm text-red-500">{error}</p>}
            <GradientButton
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !name.trim()}
            >
              {createMutation.isPending ? 'Adding…' : 'Add Category'}
            </GradientButton>
          </div>
        </div>
      )}

      {isLoading ? (
        <p className="text-vt-muted">Loading...</p>
      ) : (
        <ResponsiveTable minWidth="560px">
            <thead className="border-b border-vt-border bg-vt-surface-muted text-vt-muted">
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
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={cat.image}
                        alt=""
                        className="h-10 w-10 rounded-lg object-cover bg-vt-surface-muted"
                      />
                      <span className="font-medium">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-vt-muted">{cat.slug}</td>
                  <td className="px-4 py-3">{cat.itemCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" className="text-vt-blue" onClick={() => openEdit(cat)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="text-red-600"
                        onClick={() => openDelete(cat)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
        </ResponsiveTable>
      )}

      <AdminModal open={modal === 'edit'} title="Edit Category" onClose={closeModal}>
        <div className="space-y-4">
          <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" />
          <ImageUploadField value={editImage} onChange={setEditImage} />
          <p className="text-xs text-vt-muted">
            Products in this category: {selected?.itemCount ?? 0} (updated automatically)
          </p>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <AdminModalFooter>
            <GradientButton
              size="sm"
              onClick={() => updateMutation.mutate()}
              disabled={updateMutation.isPending || !editName.trim()}
            >
              {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
            </GradientButton>
          </AdminModalFooter>
        </div>
      </AdminModal>

      <AdminModal open={modal === 'delete'} title="Delete Category" onClose={closeModal}>
        <p className="text-sm text-vt-muted">
          Delete <strong>{selected?.name}</strong>? This only works if no products use this category.
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
