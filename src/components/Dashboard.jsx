import { useMemo, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { startOfWeek, startOfMonth, isAfter, subMonths, format } from 'date-fns';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export function Dashboard({ expenses, currency = '$' }) {
    const [view, setView] = useState('week'); // week | month | all

    const stats = useMemo(() => {
        const now = new Date();
        const startOfCurrentWeek = startOfWeek(now);
        const startOfCurrentMonth = startOfMonth(now);

        const weeklyExpenses = expenses.filter(e => isAfter(new Date(e.date), startOfCurrentWeek));
        const monthlyExpenses = expenses.filter(e => isAfter(new Date(e.date), startOfCurrentMonth));

        const weeklyTotal = weeklyExpenses.reduce((sum, e) => sum + e.amount, 0);
        const monthlyTotal = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
        const total = expenses.reduce((sum, e) => sum + e.amount, 0);

        // Group by category for pie chart (based on view)
        let filteredForChart = expenses;
        if (view === 'week') filteredForChart = weeklyExpenses;
        else if (view === 'month') filteredForChart = monthlyExpenses;

        const categoryTotals = {};
        filteredForChart.forEach(e => {
            categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
        });

        // Monthly trends (last 6 months)
        const monthlyTrends = [];
        for (let i = 5; i >= 0; i--) {
            const monthStart = startOfMonth(subMonths(now, i));
            const nextMonthStart = startOfMonth(subMonths(now, i - 1));
            const monthExpenses = expenses.filter(e => {
                const d = new Date(e.date);
                return d >= monthStart && d < nextMonthStart;
            });
            monthlyTrends.push({
                label: format(monthStart, 'MMM'),
                total: monthExpenses.reduce((sum, e) => sum + e.amount, 0)
            });
        }

        return { weeklyTotal, monthlyTotal, total, categoryTotals, monthlyTrends };
    }, [expenses, view]);

    const pieData = {
        labels: Object.keys(stats.categoryTotals),
        datasets: [{
            data: Object.values(stats.categoryTotals),
            backgroundColor: ['#6366f1', '#ec4899', '#eab308', '#22c55e', '#ef4444', '#3b82f6', '#8b5cf6', '#f97316'],
            borderWidth: 0,
        }],
    };

    const barData = {
        labels: stats.monthlyTrends.map(m => m.label),
        datasets: [{
            label: 'Monthly Spending',
            data: stats.monthlyTrends.map(m => m.total),
            backgroundColor: '#6366f1',
            borderRadius: 6,
        }],
    };

    const chartOptions = {
        cutout: '70%',
        plugins: { legend: { position: 'bottom', labels: { color: 'var(--text-muted)' } } }
    };

    const barOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
            x: { ticks: { color: 'var(--text-muted)' }, grid: { display: false } },
            y: { ticks: { color: 'var(--text-muted)' }, grid: { color: 'var(--border)' } }
        }
    };

    const displayTotal = view === 'week' ? stats.weeklyTotal : view === 'month' ? stats.monthlyTotal : stats.total;
    const displayLabel = view === 'week' ? 'Weekly Spend' : view === 'month' ? 'Monthly Spend' : 'Total Spend';

    return (
        <div>
            {/* View Toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                {['week', 'month', 'all'].map(v => (
                    <button
                        key={v}
                        onClick={() => setView(v)}
                        className="btn"
                        style={{
                            flex: 1,
                            background: view === v ? 'var(--primary)' : 'var(--bg-card)',
                            color: view === v ? 'white' : 'var(--text-muted)',
                            border: '1px solid var(--border)'
                        }}
                    >
                        {v.charAt(0).toUpperCase() + v.slice(1)}
                    </button>
                ))}
            </div>

            {/* Summary Card */}
            <div className="card" style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div className="text-sm text-muted">{displayLabel}</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{currency}{displayTotal.toFixed(2)}</div>
            </div>

            {/* Pie Chart */}
            <div className="card" style={{ marginBottom: '1rem' }}>
                <h3 className="mb-4">Category Breakdown</h3>
                <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
                    {Object.keys(stats.categoryTotals).length > 0 ? (
                        <Doughnut data={pieData} options={chartOptions} />
                    ) : (
                        <div className="text-muted" style={{ display: 'flex', alignItems: 'center' }}>No data</div>
                    )}
                </div>
            </div>

            {/* Monthly Trends Bar Chart */}
            <div className="card">
                <h3 className="mb-4">Monthly Trends</h3>
                <Bar data={barData} options={barOptions} />
            </div>
        </div>
    );
}
