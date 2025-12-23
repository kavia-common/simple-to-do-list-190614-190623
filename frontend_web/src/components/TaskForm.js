import React, { useEffect, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * TaskForm for creating or editing a task.
 * Props:
 * - initial?: { title: string, description: string }
 * - onSubmit: (data) => Promise<void> | void
 * - onCancel?: () => void
 * - submitLabel?: string
 * - heading?: string
 */
export default function TaskForm({ initial = { title: '', description: '' }, onSubmit, onCancel, submitLabel = 'Save', heading = 'Add Task' }) {
  const [title, setTitle] = useState(initial.title || '');
  const [description, setDescription] = useState(initial.description || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(initial.title || '');
    setDescription(initial.description || '');
  }, [initial]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Title is required.');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim() });
      setTitle('');
      setDescription('');
    } catch (err) {
      alert(err?.message || 'Failed to submit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.heading}>{heading}</h3>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            placeholder="Task title"
            required
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            placeholder="Task description"
            rows={3}
          />
        </div>
        <div style={styles.actions}>
          <button type="submit" disabled={loading} style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}>
            {submitLabel}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} style={{ ...styles.buttonOutline }}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  heading: { margin: 0, marginBottom: 12, color: '#111827' },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 14, color: '#374151' },
  input: {
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    outline: 'none',
  },
  textarea: {
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    outline: 'none',
    resize: 'vertical',
  },
  actions: { display: 'flex', gap: 8, marginTop: 4 },
  button: {
    backgroundColor: '#06b6d4',
    color: '#ffffff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: 8,
    cursor: 'pointer',
  },
  buttonOutline: {
    backgroundColor: '#ffffff',
    color: '#111827',
    border: '1px solid #e5e7eb',
    padding: '10px 16px',
    borderRadius: 8,
    cursor: 'pointer',
  },
};
