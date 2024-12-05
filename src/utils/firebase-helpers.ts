import { 
  collection, 
  query, 
  getDocs, 
  QueryConstraint,
  getDocsFromCache,
  getDocsFromServer,
  DocumentData,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

export async function fetchWithOfflineSupport<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const q = query(collection(db, collectionName), ...constraints);
  const cacheKey = `${collectionName}-${constraints.map(c => c.toString()).join('-')}`;
  
  // Check memory cache first
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    // Try IndexedDB cache first
    const cachedDocs = await getDocsFromCache(q);
    if (!cachedDocs.empty) {
      const data = cachedDocs.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      cache.set(cacheKey, { data, timestamp: Date.now() });
      return data as T[];
    }
  } catch (e) {
    // Cache miss, continue to server fetch
  }

  // Fetch from server with retry
  let retries = 3;
  let lastError: any;

  while (retries > 0) {
    try {
      const snapshot = await getDocsFromServer(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      cache.set(cacheKey, { data, timestamp: Date.now() });
      return data as T[];
    } catch (error) {
      lastError = error;
      retries--;
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  // If all retries failed, try to return cached data if available
  const fallbackCache = cache.get(cacheKey);
  if (fallbackCache) {
    return fallbackCache.data;
  }

  throw lastError || new Error('Failed to fetch data');
}

export function handleFirebaseError(error: FirestoreError | any): string {
  if (!error) return 'An unknown error occurred';
  
  switch (error.code) {
    case 'unavailable':
      return 'Network error. The app will continue working offline.';
    case 'permission-denied':
      return 'You don\'t have permission to perform this action.';
    case 'not-found':
      return 'The requested resource was not found.';
    case 'already-exists':
      return 'This resource already exists.';
    case 'failed-precondition':
      return 'Operation failed. Please try again.';
    case 'unauthenticated':
      return 'Please sign in to continue.';
    case 'resource-exhausted':
      return 'Too many requests. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred';
  }
}