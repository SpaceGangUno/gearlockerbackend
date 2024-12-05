import { useState, useEffect, useCallback } from 'react';
import { Schedule, getSchedule } from '../services/schedule';
import { startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { useAuthStore } from '../stores/authStore';

export const useSchedule = () => {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const { user } = useAuthStore();

  const fetchSchedule = useCallback(async () => {
    if (!user) return;
    try {
      const start = startOfWeek(currentWeek);
      const end = endOfWeek(currentWeek);
      const scheduleData = await getSchedule(start, end);
      setSchedule(scheduleData);
    } catch (err) {
      setError('Failed to fetch schedule');
    } finally {
      setLoading(false);
    }
  }, [currentWeek, user]);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek),
    end: endOfWeek(currentWeek)
  });

  const nextWeek = () => setCurrentWeek(date => endOfWeek(date));
  const prevWeek = () => setCurrentWeek(date => startOfWeek(new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000)));

  return {
    schedule,
    loading,
    error,
    currentWeek,
    weekDays,
    nextWeek,
    prevWeek,
    refetch: fetchSchedule
  };
};