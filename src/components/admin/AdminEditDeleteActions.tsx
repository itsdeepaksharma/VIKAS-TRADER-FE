import { Pencil, Trash2 } from 'lucide-react';

import { AdminIconButton } from './AdminIconButton';

type AdminEditDeleteActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
  editLabel?: string;
  deleteLabel?: string;
};

export function AdminEditDeleteActions({
  onEdit,
  onDelete,
  editLabel = 'Edit',
  deleteLabel = 'Delete',
}: AdminEditDeleteActionsProps) {
  return (
    <div className="flex items-center gap-1">
      <AdminIconButton label={editLabel} icon={Pencil} variant="edit" onClick={onEdit} />
      <AdminIconButton label={deleteLabel} icon={Trash2} variant="delete" onClick={onDelete} />
    </div>
  );
}
