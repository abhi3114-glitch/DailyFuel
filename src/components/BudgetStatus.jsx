export function BudgetStatus({ expenses, limit, currency = '$' }) {
    if (!limit || limit <= 0) return null;

    // Calculate today's spend
    const today = new Date().toDateString();
    const todaySpend = expenses
        .filter(e => new Date(e.date).toDateString() === today)
        .reduce((sum, e) => sum + e.amount, 0);

    const percent = Math.min((todaySpend / limit) * 100, 100);
    const isOver = todaySpend > limit;

    return (
        <div className="card" style={{
            borderColor: isOver ? 'var(--danger)' : 'var(--border)',
            background: isOver ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-card)'
        }}>
            <div className="flex-between mb-4">
                <div style={{ fontWeight: 500 }}>Daily Budget</div>
                <div style={{ fontWeight: 'bold', color: isOver ? 'var(--danger)' : 'var(--text-main)' }}>
                    {currency}{todaySpend.toFixed(2)} / {currency}{limit.toFixed(2)}
                </div>
            </div>
            <div style={{ height: '8px', background: 'var(--bg-dark)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                    height: '100%',
                    width: `${percent}%`,
                    background: isOver ? 'var(--danger)' : 'var(--success)',
                    transition: 'width 0.3s'
                }} />
            </div>
            {isOver && <div className="text-sm mt-4" style={{ color: 'var(--danger)' }}>You have exceeded your daily limit!</div>}
        </div>
    );
}
