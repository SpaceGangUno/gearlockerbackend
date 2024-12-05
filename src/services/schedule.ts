import { collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Schedule {
  id: string;
  userId: string;
  startTime: Date;
  endTime: Date;
}

export const getSchedule = async (startDate: Date, endDate: Date): Promise<Schedule[]> => {
  const q = query(
    collection(db, 'schedules'),
    where('startTime', '>=', Timestamp.fromDate(startDate)),
    where('startTime', '<=', Timestamp.fromDate(endDate))
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    startTime: doc.data().startTime.toDate(),
    endTime: doc.data().endTime.toDate()
  })) as Schedule[];
};