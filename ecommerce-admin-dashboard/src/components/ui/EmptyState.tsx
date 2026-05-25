import React from 'react';
import Button from '../ui/Button';

type Props = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({
  title = 'No items',
  description = 'Nothing to display here yet.',
  icon = (
    <div className="text-4xl">📭</div>
  ),
  actionLabel,
  onAction,
}: Props) {
  return (
    <div className="py-16 flex flex-col items-center justify-center text-center text-slate-600 space-y-4">
      <div className="bg-slate-50 rounded-2xl p-6 shadow-sm">{icon}</div>
      <div className="text-lg font-semibold text-slate-800">{title}</div>
      <div className="text-sm text-slate-500 max-w-xl">{description}</div>
      {actionLabel && (
        <div>
          <Button variant="primary" onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
}
