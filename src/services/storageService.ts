// services/storageService.ts
import { storage } from '@/services/firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export const uploadImage = async (file: File, path: string): Promise<string> => {
  try {
    // Construir la ruta de almacenamiento dinámicamente
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw new Error('No se pudo subir la imagen');
  }
};

/**
 * Sube un archivo a una ruta específica en Firebase Storage.
 * @param file - Archivo a subir.
 * @param path - Ruta de almacenamiento en Firebase Storage.
 * @returns URL de descarga del archivo.
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error al subir el archivo:', error);
    throw error;
  }
};