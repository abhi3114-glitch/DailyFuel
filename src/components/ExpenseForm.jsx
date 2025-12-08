import { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';

export function ExpenseForm({ onAdd, currency = '$', categories }) {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState(categories[0]);
    const [note, setNote] = useState('');
    const [isRecurring, setIsRecurring] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount) return;

        onAdd({
            amount: parseFloat(amount),
            category,
            note,
            isRecurring
        });

        setAmount('');
        setNote('');
        setIsRecurring(false);
    };

    return (
        <form onSubmit={handleSubmit} className="card">
            <h2 className="mb-4">Quick Add</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                    <label className="text-sm text-muted">Amount ({currency})</label>
                    <input
                        type="number"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        autoFocus
                        required
                        style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                    />
                </div>

                <div>
                    <label className="text-sm text-muted">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        {categories.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm text-muted">Note (Optional)</label>
                    <input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="What was it?"
                    />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                        type="checkbox"
                        id="newRecurring"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        style={{ width: 'auto' }}
                    />
                    <label htmlFor="newRecurring" className="text-sm" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <RefreshCw size={14} /> Recurring (monthly)
                    </label>
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    <Plus size={20} style={{ marginRight: '8px' }} />
                    Add Expense
                </button>
            </div>
        </form>
    );
}
