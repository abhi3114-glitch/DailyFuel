import { useState, useEffect } from 'react';
import { Download, Trash, Database, Settings, Sun, Moon, Search, X, Plus } from 'lucide-react';
import { useExpenses } from './hooks/useExpenses';
import { ExpenseForm } from './components/ExpenseForm';
import { Dashboard } from './components/Dashboard';
import { ExpenseList } from './components/ExpenseList';
import { BudgetStatus } from './components/BudgetStatus';
import { EditModal } from './components/EditModal';
import './index.css';

function App() {
  const {
    expenses, addExpense, updateExpense, deleteExpense, loadDemoData, clearExpenses,
    dailyLimit, setDailyLimit, currency, setCurrency, theme, toggleTheme,
    categories, customCategories, addCategory, removeCategory
  } = useExpenses();

  const [showSettings, setShowSettings] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Apply theme on mount
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const exportCSV = () => {
    if (expenses.length === 0) {
      alert("No expenses to export!");
      return;
    }
    const headers = ['ID,Amount,Category,Date,Note,IsRecurring'];
    const rows = expenses.map(e => `${e.id},${e.amount},${e.category},${e.date},"${e.note || ''}",${e.isRecurring || false}`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dailyfuel_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleSaveEdit = (updates) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, updates);
      setEditingExpense(null);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '80px' }}>
      <header className="flex-between mb-4" style={{ paddingTop: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem', marginRight: '5px' }}>⛽</span>
          <h1>DailyFuel</h1>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={toggleTheme} className="btn" title="Toggle Theme" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            {theme === 'dark' ? <Sun size={20} color="var(--text-muted)" /> : <Moon size={20} color="var(--text-muted)" />}
          </button>
          <button onClick={exportCSV} className="btn" title="Export CSV" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <Download size={20} color="var(--text-muted)" />
          </button>
          <button onClick={() => setShowSettings(!showSettings)} className="btn" title="Settings" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <Settings size={20} color="var(--text-muted)" />
          </button>
        </div>
      </header>

      {showSettings && (
        <div className="card mb-4">
          <h3 className="mb-4">Settings</h3>

          {/* Currency */}
          <div className="mb-4">
            <label className="text-sm text-muted">Currency Symbol</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
              <option value="$">$ (USD)</option>
              <option value="€">€ (EUR)</option>
              <option value="£">£ (GBP)</option>
              <option value="₹">₹ (INR)</option>
              <option value="¥">¥ (JPY)</option>
              <option value="kr">kr (SEK)</option>
            </select>
          </div>

          {/* Daily Limit */}
          <div className="mb-4">
            <label className="text-sm text-muted">Daily Limit ({currency})</label>
            <input type="number" value={dailyLimit} onChange={(e) => setDailyLimit(parseFloat(e.target.value) || 0)} placeholder="0.00" />
          </div>

          {/* Custom Categories */}
          <div className="mb-4">
            <label className="text-sm text-muted">Custom Categories</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="New category name" style={{ flex: 1 }} />
              <button onClick={handleAddCategory} className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                <Plus size={16} />
              </button>
            </div>
            {customCategories.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {customCategories.map(cat => (
                  <span key={cat} style={{ background: 'var(--primary)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {cat}
                    <button onClick={() => removeCategory(cat)} style={{ background: 'transparent', padding: 0 }}><X size={12} color="white" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={loadDemoData} className="btn" style={{ border: '1px solid var(--primary)', color: 'var(--primary)', flex: 1 }}>
              <Database size={16} style={{ marginRight: '8px' }} />
              Load Demo
            </button>
            <button onClick={() => { if (confirm('Clear all data?')) clearExpenses(); }} className="btn" style={{ border: '1px solid var(--danger)', color: 'var(--danger)', flex: 1 }}>
              <Trash size={16} style={{ marginRight: '8px' }} />
              Clear Data
            </button>
          </div>
        </div>
      )}

      <BudgetStatus expenses={expenses} limit={dailyLimit} currency={currency} />

      <div className="mb-4"></div>

      <ExpenseForm onAdd={addExpense} currency={currency} categories={categories} />

      <div className="mb-4"></div>

      <Dashboard expenses={expenses} currency={currency} />

      <div className="mb-4"></div>

      {/* Search & Filter */}
      <div className="card mb-4">
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search expenses..." style={{ paddingLeft: '40px' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} title="From Date" />
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} title="To Date" />
          </div>
        </div>
      </div>

      <ExpenseList
        expenses={expenses}
        onDelete={deleteExpense}
        onEdit={setEditingExpense}
        currency={currency}
        searchQuery={searchQuery}
        categoryFilter={categoryFilter}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />

      <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        DailyFuel | Stored locally
      </div>

      {editingExpense && (
        <EditModal
          expense={editingExpense}
          categories={categories}
          onSave={handleSaveEdit}
          onClose={() => setEditingExpense(null)}
        />
      )}
    </div>
  );
}

export default App;
