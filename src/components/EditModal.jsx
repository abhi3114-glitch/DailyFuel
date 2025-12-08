import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export function EditModal({ expense, categories, onSave, onClose }) {
    const [amount, setAmount] = useState(expense.amount.toString());
    const [category, setCategory] = useState(expense.category);
    const [note, setNote] = useState(expense.note || '');
    const [isRecurring, setIsRecurring] = useState(expense.isRecurring || false);

    useEffect(() => {
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!amount) return;
        onSave({
            amount: parseFloat(amount),
            category,
            note,
            isRecurring
        });
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="card" style={{ width: '90%', maxWidth: '400px', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent' }}>
                    <X size={20} color="var(--text-muted)" />
                </button>
                <h3 className="mb-4">Edit Expense</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <label className="text-sm text-muted">Amount</label>
                        <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                    </div>
                    <div>
                        <label className="text-sm text-muted">Category</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)}>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-sm text-muted">Note</label>
                        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" id="recurring" checked={isRecurring} onChange={(e) => setIsRecurring(e.target.checked)} style={{ width: 'auto' }} />
                        <label htmlFor="recurring" className="text-sm">Recurring (monthly)</label>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Changes</button>
                </form>
            </div>
        </div>
    );
}
