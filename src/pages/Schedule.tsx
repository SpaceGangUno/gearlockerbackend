import { motion } from 'framer-motion';
import { format, isToday, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';
import { useSchedule } from '../hooks/useSchedule';
import { Button } from '../components/ui/button';
import { PageHeader } from '../components/ui/page-header';
import { LoadingSpinner } from '../components/ui/loading-spinner';
import { cn } from '../utils/cn';

const Schedule = () => {
  const { 
    schedule, 
    loading, 
    error, 
    currentWeek, 
    weekDays, 
    nextWeek, 
    prevWeek 
  } = useSchedule();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const getScheduleForDay = (date: Date) => {
    return schedule.filter(shift => 
      format(shift.startTime, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Schedule">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white rounded-md shadow-sm p-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={prevWeek}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium text-gray-900 px-2">
              {format(currentWeek, 'MMMM d, yyyy')}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={nextWeek}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <Button leftIcon={<Plus className="h-4 w-4" />}>
            Add Shift
          </Button>
        </div>
      </PageHeader>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white shadow-sm rounded-lg overflow-hidden"
      >
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {weekDays.map((day, index) => (
            <motion.div
              key={day.toString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={cn(
                'bg-white p-4 min-h-[200px]',
                isToday(day) && 'bg-indigo-50',
                !isSameMonth(day, currentWeek) && 'opacity-50'
              )}
            >
              <div className="flex flex-col">
                <span className={cn(
                  'text-sm font-medium',
                  isToday(day) ? 'text-indigo-600' : 'text-gray-900'
                )}>
                  {format(day, 'EEEE')}
                </span>
                <span className={cn(
                  'text-sm',
                  isToday(day) ? 'text-indigo-600 font-semibold' : 'text-gray-500'
                )}>
                  {format(day, 'MMM d')}
                </span>
              </div>

              <div className="mt-2 space-y-1">
                {getScheduleForDay(day).map((shift) => (
                  <motion.div
                    key={shift.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      'rounded-md p-2 text-sm',
                      'bg-indigo-100 text-indigo-700',
                      'hover:bg-indigo-200 transition-colors cursor-pointer'
                    )}
                  >
                    <div className="font-medium">
                      {format(shift.startTime, 'h:mm a')}
                    </div>
                    <div className="text-indigo-600">
                      {format(shift.endTime, 'h:mm a')}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'mt-2 w-full py-1 text-sm text-gray-500',
                  'hover:text-indigo-600 hover:bg-indigo-50 rounded-md',
                  'transition-colors duration-200 ease-in-out'
                )}
              >
                <Plus className="h-4 w-4 mx-auto" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Schedule;