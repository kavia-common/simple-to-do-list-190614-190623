import React, { useState, useEffect } from 'react';

/**
 * PUBLIC_INTERFACE
 * SearchBar component for searching tasks by substring.
 * Props:
 * - initialQuery?: string
 * - onSearch: (q: string) => void
 */
export default function SearchBar({ initialQuery = '', onSearch }) {
  const [q, setQ] = useState(initialQuery);

  useEffect(() => {
    setQ(initialQuery);
  }, [initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(q.trim());
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Search tasks" style={styles.form}>
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by title or description..."
        aria-label="Search input"
        style={styles.input}
      />
      <button type="submit" style={styles.button}>Search</button>
    </form>
  );
}

const styles = {
  form: {
    display: 'flex',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    padding: '10px 12px',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    outline: 'none',
  },
  button: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    padding: '10px 16px',
    borderRadius: 8,
    cursor: 'pointer',
  },
};
