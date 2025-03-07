import { db } from './firebaseConfig'; // Importa la instancia de Firestore
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, DocumentData, DocumentReference } from 'firebase/firestore';

// Obtener todos los documentos de una colección
export const fetchDocuments = async <T>(collectionName: string, _ref: string): Promise<T[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName));
    const documents = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
    return documents;
  } catch (error) {
    console.error(`Error al obtener los documentos de ${collectionName}:`, error);
    throw error;
  }
};

// Obtener un documento específico por ID
export const getDocumentById = async <T>(collectionName: string, documentId: string): Promise<T | null> => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } catch (error) {
    console.error(`Error al obtener el documento de ${collectionName} con ID ${documentId}:`, error);
    throw error;
  }
};

// Crear un nuevo documento en una colección
export const createDocument = async <T extends DocumentData>(collectionName: string, data: T): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, collectionName), data);
    return docRef.id; // Retorna el ID del nuevo documento
  } catch (error) {
    console.error(`Error al crear el documento en ${collectionName}:`, error);
    throw error;
  }
};

// Actualizar un documento existente en una colección
export const updateDocument = async <T>(collectionName: string, id: string, data: Partial<T>): Promise<void> => {
  try {
    await updateDoc(doc(db, collectionName, id), data);
  } catch (error) {
    console.error(`Error al actualizar el documento en ${collectionName}:`, error);
    throw error;
  }
};

// Eliminar un documento de una colección
export const deleteDocument = async (collectionName: string, id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error) {
    console.error(`Error al eliminar el documento de ${collectionName}:`, error);
    throw error;
  }
};

// Crear una referencia a un documento
export const createDocRef = (collectionName: string, documentId: string): DocumentReference => {
  return doc(db, collectionName, documentId);
};