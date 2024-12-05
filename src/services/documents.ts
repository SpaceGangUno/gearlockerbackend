import { collection, query, getDocs, addDoc, updateDoc, doc, getDoc, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { fetchWithOfflineSupport, handleFirebaseError } from '../utils/firebase-helpers';

export interface Document {
  id: string;
  title: string;
  type: string;
  description: string;
  notes?: string;
  dueDate: Date;
  status: 'PENDING' | 'SIGNED' | 'REJECTED';
  createdAt: Date;
  signedAt?: Date;
}

interface UploadDocumentData {
  title: string;
  type: string;
  description: string;
  notes?: string;
  dueDate: string;
}

export const uploadDocument = async (data: UploadDocumentData): Promise<void> => {
  try {
    await addDoc(collection(db, 'documents'), {
      ...data,
      dueDate: new Date(data.dueDate),
      status: 'PENDING',
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    throw new Error(handleFirebaseError(error));
  }
};

export const getDocuments = async (): Promise<Document[]> => {
  try {
    const documents = await fetchWithOfflineSupport<Document>('documents', [
      orderBy('createdAt', 'desc'),
      limit(50)
    ]);

    return documents.map(doc => ({
      ...doc,
      createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
      dueDate: doc.dueDate instanceof Date ? doc.dueDate : new Date(doc.dueDate),
      signedAt: doc.signedAt ? new Date(doc.signedAt) : undefined
    }));
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw new Error(handleFirebaseError(error));
  }
};

export const signDocument = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'documents', id);
    await updateDoc(docRef, {
      status: 'SIGNED',
      signedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error signing document:', error);
    throw new Error(handleFirebaseError(error));
  }
};

export const getDocument = async (id: string): Promise<Document> => {
  try {
    const docRef = doc(db, 'documents', id);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error('Document not found');
    }
    
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt.toDate(),
      dueDate: data.dueDate.toDate(),
      signedAt: data.signedAt?.toDate()
    } as Document;
  } catch (error) {
    console.error('Error fetching document:', error);
    throw new Error(handleFirebaseError(error));
  }
};