import { collection, query, getDocs, where, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

export interface Sale {
  id: string;
  amount: number;
  date: Date;
  userId: string;
}

export const getSalesByDateRange = async (startDate: Date, endDate: Date): Promise<Sale[]> => {
  const q = query(
    collection(db, 'sales'),
    where('date', '>=', Timestamp.fromDate(startDate)),
    where('date', '<=', Timestamp.fromDate(endDate)),
    orderBy('date', 'desc'),
    limit(100)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date.toDate()
  })) as Sale[];
};

export const getSalesForPeriod = async (period: 'day' | 'week' | 'month'): Promise<Sale[]> => {
  let start: Date;
  let end: Date;
  const now = new Date();

  switch (period) {
    case 'day':
      start = startOfDay(now);
      end = endOfDay(now);
      break;
    case 'week':
      start = startOfWeek(now);
      end = endOfWeek(now);
      break;
    case 'month':
      start = startOfMonth(now);
      end = endOfMonth(now);
      break;
  }

  return getSalesByDateRange(start, end);
};