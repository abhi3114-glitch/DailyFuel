import { useState, useEffect, useCallback } from 'react';

export const DEFAULT_CATEGORIES = [
    'Food', 'Transport', 'Shopping', 'Entertainment', 'Health', 'Bills', 'Other'
];

const STORAGE_KEY = 'dailyfuel_expenses';
const BUDGET_KEY = 'dailyfuel_limit';
const CURRENCY_KEY = 'dailyfuel_currency';
const THEME_KEY = 'dailyfuel_theme';
const CUSTOM_CATEGORIES_KEY = 'dailyfuel_custom_categories';

export function useExpenses() {
    const [expenses, setExpenses] = useState(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Failed to load expenses", e);
            return [];
        }
    });

    const [dailyLimit, setDailyLimit] = useState(() => {
        const stored = localStorage.getItem(BUDGET_KEY);
        return stored ? parseFloat(stored) : 0;
    });

    const [currency, setCurrency] = useState(() => {
        return localStorage.getItem(CURRENCY_KEY) || '$';
    });

    const [theme, setTheme] = useState(() => {
        return localStorage.getItem(THEME_KEY) || 'dark';
    });

    const [customCategories, setCustomCategories] = useState(() => {
        try {
            const stored = localStorage.getItem(CUSTOM_CATEGORIES_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Derived: all categories
    const categories = [...DEFAULT_CATEGORIES, ...customCategories];

    // Persist effects
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    }, [expenses]);

    useEffect(() => {
        localStorage.setItem(BUDGET_KEY, dailyLimit.toString());
    }, [dailyLimit]);

    useEffect(() => {
        localStorage.setItem(CURRENCY_KEY, currency);
    }, [currency]);

    useEffect(() => {
        localStorage.setItem(THEME_KEY, theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem(CUSTOM_CATEGORIES_KEY, JSON.stringify(customCategories));
    }, [customCategories]);

    // CRUD
    const addExpense = useCallback((expense) => {
        const newExpense = {
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            isRecurring: false,
            ...expense
        };
        setExpenses(prev => [newExpense, ...prev]);
    }, []);

    const updateExpense = useCallback((id, updates) => {
        setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    }, []);

    const deleteExpense = useCallback((id) => {
        setExpenses(prev => prev.filter(e => e.id !== id));
    }, []);

    // Categories
    const addCategory = useCallback((name) => {
        const trimmed = name.trim();
        if (trimmed && !categories.includes(trimmed)) {
            setCustomCategories(prev => [...prev, trimmed]);
        }
    }, [categories]);

    const removeCategory = useCallback((name) => {
        setCustomCategories(prev => prev.filter(c => c !== name));
    }, []);

    // Demo
    const loadDemoData = useCallback(() => {
        const now = Date.now();
        const demoData = [
            { id: crypto.randomUUID(), amount: 15.50, category: 'Food', date: new Date(now - 1000 * 60 * 60 * 2).toISOString(), note: 'Lunch' },
            { id: crypto.randomUUID(), amount: 45.00, category: 'Transport', date: new Date(now - 1000 * 60 * 60 * 24).toISOString(), note: 'Gas' },
            { id: crypto.randomUUID(), amount: 120.00, category: 'Shopping', date: new Date(now - 1000 * 60 * 60 * 48).toISOString(), note: 'Groceries' },
            { id: crypto.randomUUID(), amount: 25.00, category: 'Entertainment', date: new Date(now - 1000 * 60 * 60 * 5).toISOString(), note: 'Cinema' },
            { id: crypto.randomUUID(), amount: 9.99, category: 'Bills', date: new Date(now - 1000 * 60 * 60 * 24 * 3).toISOString(), note: 'Netflix', isRecurring: true },
            // Extra for monthly
            { id: crypto.randomUUID(), amount: 200.00, category: 'Bills', date: new Date(now - 1000 * 60 * 60 * 24 * 35).toISOString(), note: 'Last month rent' },
            { id: crypto.randomUUID(), amount: 80.00, category: 'Food', date: new Date(now - 1000 * 60 * 60 * 24 * 40).toISOString(), note: 'Dinner party' },
        ];
        setExpenses(prev => [...demoData, ...prev]);
    }, []);

    const clearExpenses = useCallback(() => setExpenses([]), []);

    const toggleTheme = useCallback(() => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    }, []);

    return {
        expenses,
        dailyLimit,
        setDailyLimit,
        currency,
        setCurrency,
        theme,
        toggleTheme,
        categories,
        customCategories,
        addCategory,
        removeCategory,
        addExpense,
        updateExpense,
        deleteExpense,
        loadDemoData,
        clearExpenses
    };
}
