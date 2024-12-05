import { useState, useEffect, useCallback } from 'react';
import { Sale, getSalesForPeriod } from '../services/sales';
import { useAuthStore } from '../stores/authStore';

export const useSales = (period: 'day' | 'week' | 'month' = 'day') => {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  const fetchSales = useCallback(async () => {
    if (!user) return;
    try {
      const salesData = await getSalesForPeriod(period);
      setSales(salesData);
    } catch (err) {
      setError('Failed to fetch sales data');
    } finally {
      setLoading(false);
    }
  }, [period, user]);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const todaySales = sales.filter(sale => 
    new Date(sale.date).toDateString() === new Date().toDateString()
  ).reduce((sum, sale) => sum + sale.amount, 0);

  return {
    sales,
    totalSales,
    todaySales,
    loading,
    error,
    refetch: fetchSales
  };
};