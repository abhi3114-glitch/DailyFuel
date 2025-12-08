import { useState, useMemo } from 'react';
import { Trash2, Pencil, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export function ExpenseList({ expenses, onDelete, onEdit, currency = '$', searchQuery = '', categoryFilter = '', dateFrom = '', dateTo = '' }) {
    // Filter expenses
    const filteredExpenses = useMemo(() => {
        return expenses
            .filter(e => {
                // Search
                if (searchQuery) {
                    const q = searchQuery.toLowerCase();
                    if (!e.category.toLowerCase().includes(q) && !(e.note || '').toLowerCase().includes(q)) {
                        return false;
                    }
                }
                // Category
                if (categoryFilter && e.category !== categoryFilter) return false;
                // Date range
                const expDate = new Date(e.date);
                if (dateFrom && expDate < new Date(dateFrom)) return false;
                if (dateTo && expDate > new Date(dateTo + 'T23:59:59')) return false;
                return true;
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 20);
    }, [expenses, searchQuery, categoryFilter, dateFrom, dateTo]);

    if (expenses.length === 0) return null;

    return (
        <div className="card">
            <h3 className="mb-4">Recent Activity</h3>
            {filteredExpenses.length === 0 ? (
                <div className="text-muted text-sm">No matching expenses found.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {filteredExpenses.map(expense => (
                        <div key={expense.id} className="flex-between" style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)' }}>
                            <div>
                                <div style={{ fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {expense.category}
                                    {expense.isRecurring && <RefreshCw size={12} color="var(--primary)" title="Recurring" />}
                                </div>
                                <div className="text-sm text-muted">
                                    {format(new Date(expense.date), 'MMM d, h:mm a')}
                                    {expense.note && ` - ${expense.note}`}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontWeight: 'bold' }}>{currency}{expense.amount.toFixed(2)}</span>
                                <button onClick={() => onEdit(expense)} className="text-muted" style={{ background: 'transparent', padding: '4px' }} aria-label="Edit">
                                    <Pencil size={14} />
                                </button>
                                <button onClick={() => onDelete(expense.id)} className="text-muted" style={{ background: 'transparent', padding: '4px' }} aria-label="Delete">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
