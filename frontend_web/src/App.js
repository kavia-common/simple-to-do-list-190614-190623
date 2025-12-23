import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './index.css';
import SearchBar from './components/SearchBar';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { apiBaseUrl, createTask, deleteTask, fetchTasks, toggleTask, updateTask } from './api/client';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [editing, setEditing] = useState(null); // task being edited

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const infoText = useMemo(() => {
    return `Backend: ${apiBaseUrl}`;
  }, []);

  async function load() {
    setLoading(true);
    setErr('');
    try {
      const data = await fetchTasks({ page, pageSize, search });
      setItems(data.items || data.results || data.data || []);
      setTotal(data.total ?? data.count ?? 0);
    } catch (e) {
      console.error(e);
      const msg = e?.message || 'Failed to load tasks';
      setErr(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, search]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // PUBLIC_INTERFACE
  async function handleCreate(data) {
    await createTask(data);
    setPage(1);
    await load();
  }

  // PUBLIC_INTERFACE
  async function handleUpdate(data) {
    if (!editing) return;
    await updateTask(editing.id, data);
    setEditing(null);
    await load();
  }

  // PUBLIC_INTERFACE
  async function handleDelete(id) {
    await deleteTask(id);
    // Keep in same page if possible
    await load();
  }

  // PUBLIC_INTERFACE
  async function handleToggle(task) {
    await toggleTask(task.id, task.status);
    await load();
  }

  const containerStyles = {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    color: '#111827',
  };

  return (
    <div className="App" style={containerStyles}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>To-do Manager</h1>
          <span style={styles.subtle}>Simple tasks with CRUD, pagination & search</span>
        </div>
        <div style={styles.headerRight}>
          <span style={styles.backend}>{infoText}</span>
          <button
            style={styles.themeToggle}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.panel}>
          <SearchBar
            initialQuery={search}
            onSearch={(q) => {
              setPage(1);
              setSearch(q);
            }}
          />
          {editing ? (
            <TaskForm
              initial={{ title: editing.title, description: editing.description }}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
              submitLabel="Update"
              heading="Edit Task"
            />
          ) : (
            <TaskForm onSubmit={handleCreate} submitLabel="Add Task" heading="Add Task" />
          )}
        </section>

        <section style={styles.panel}>
          {loading && <div style={styles.bannerInfo}>Loading...</div>}
          {err && <div style={styles.bannerError}>{err}</div>}

          <TaskList
            items={items}
            page={page}
            pageSize={pageSize}
            total={total}
            onEdit={setEditing}
            onDelete={handleDelete}
            onToggle={handleToggle}
            onPageChange={setPage}
          />
        </section>
      </main>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 16,
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#ffffff',
  },
  headerLeft: { display: 'flex', flexDirection: 'column' },
  headerRight: { display: 'flex', alignItems: 'center', gap: 12 },
  title: { margin: 0, color: '#111827' },
  subtle: { color: '#6b7280', fontSize: 14 },
  backend: {
    color: '#111827',
    backgroundColor: '#e5e7eb',
    padding: '6px 10px',
    borderRadius: 999,
    fontSize: 12,
  },
  themeToggle: {
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 12px',
    cursor: 'pointer',
  },
  main: {
    maxWidth: 800,
    margin: '0 auto',
    padding: 16,
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  panel: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: 12,
    padding: 16,
    boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  },
  bannerInfo: {
    backgroundColor: '#DBEAFE',
    color: '#1E3A8A',
    padding: '8px 12px',
    borderRadius: 8,
    marginBottom: 10,
  },
  bannerError: {
    backgroundColor: '#FEE2E2',
    color: '#7F1D1D',
    padding: '8px 12px',
    borderRadius: 8,
    marginBottom: 10,
  },
};

export default App;
