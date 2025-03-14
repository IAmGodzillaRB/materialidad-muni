import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const storage = getStorage(); // Inicializa Firebase Storage

export const subirImagenYGuardarURL = async (file: File): Promise<string> => {
  try {
    // Crear una referencia al archivo en Firebase Storage
    const storageRef = ref(storage, `municipios/${file.name}`);
    
    // Subir el archivo
    await uploadBytes(storageRef, file);
    
    // Obtener la URL de descarga
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error al subir la imagen:', error);
    throw new Error('No se pudo subir la imagen');
  }
};