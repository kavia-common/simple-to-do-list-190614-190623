import React from 'react';
import TaskItem from './TaskItem';

/**
 * PUBLIC_INTERFACE
 * TaskList renders a list of tasks and pagination controls.
 * Props:
 * - items: array
 * - page: number
 * - pageSize: number
 * - total: number
 * - onEdit: (task) => void
 * - onDelete: (id) => void
 * - onToggle: (task) => void
 * - onPageChange: (page: number) => void
 */
export default function TaskList({ items, page, pageSize, total, onEdit, onDelete, onToggle, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {items.length === 0 ? (
        <div style={styles.empty}>No tasks found.</div>
      ) : (
        items.map((t) => (
          <TaskItem key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} onToggle={onToggle} />
        ))
      )}
      <div style={styles.pagination} role="navigation" aria-label="Pagination">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          style={{ ...styles.pageBtn, opacity: page <= 1 ? 0.5 : 1 }}
        >
          Prev
        </button>
        <span style={styles.pageInfo}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          style={{ ...styles.pageBtn, opacity: page >= totalPages ? 0.5 : 1 }}
        >
          Next
        </button>
      </div>
    </div>
  );
}

const styles = {
  empty: {
    padding: 16,
    textAlign: 'center',
    color: '#6b7280',
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  pageBtn: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  pageInfo: { color: '#111827', fontSize: 14 },
};
