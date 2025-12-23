import React from 'react';

/**
 * PUBLIC_INTERFACE
 * TaskItem displays a task and exposes actions.
 * Props:
 * - task: { id, title, description, status }
 * - onEdit: (task) => void
 * - onDelete: (id) => void
 * - onToggle: (task) => void
 */
export default function TaskItem({ task, onEdit, onDelete, onToggle }) {
  const isCompleted = task.status === 'completed';

  return (
    <div style={styles.item} role="group" aria-label={`Task ${task.title}`}>
      <div style={styles.info}>
        <div style={styles.titleRow}>
          <span style={{ ...styles.title, textDecoration: isCompleted ? 'line-through' : 'none' }}>
            {task.title}
          </span>
          <span style={{ ...styles.badge, backgroundColor: isCompleted ? '#06b6d4' : '#3b82f6' }}>
            {isCompleted ? 'Completed' : 'Pending'}
          </span>
        </div>
        {task.description ? (
          <p style={styles.desc}>{task.description}</p>
        ) : null}
      </div>
      <div style={styles.actions}>
        <button onClick={() => onToggle(task)} style={{ ...styles.actionBtn, backgroundColor: '#3b82f6' }}>
          {isCompleted ? 'Mark Pending' : 'Mark Done'}
        </button>
        <button onClick={() => onEdit(task)} style={{ ...styles.actionBtn, backgroundColor: '#06b6d4' }}>
          Edit
        </button>
        <button
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this task?')) onDelete(task.id);
          }}
          style={{ ...styles.actionBtn, backgroundColor: '#EF4444' }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 12,
    padding: 12,
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  info: { flex: 1 },
  titleRow: { display: 'flex', alignItems: 'center', gap: 8 },
  title: { fontSize: 16, fontWeight: 600, color: '#111827' },
  badge: {
    color: '#ffffff',
    fontSize: 12,
    padding: '4px 8px',
    borderRadius: 999,
  },
  desc: { margin: '6px 0 0 0', color: '#374151', fontSize: 14 },
  actions: { display: 'flex', alignItems: 'center', gap: 8 },
  actionBtn: {
    color: '#ffffff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 13,
  },
};
