import { createDocument, updateDocument, deleteDocument, getDocumentById, fetchDocuments } from './firestoreService';
import { Autoridad } from '../types/Autoridad';
import { Municipio } from '../types/Municipio';

export const crearAutoridad = async (autoridad: Autoridad): Promise<string> => {
  return await createDocument('autoridades', autoridad);
};

export const actualizarAutoridad = async (id: string, autoridad: Autoridad): Promise<void> => {
  await updateDocument('autoridades', id, autoridad);
};

export const eliminarAutoridad = async (id: string): Promise<void> => {
  await deleteDocument('autoridades', id);
};

export const obtenerAutoridadPorId = async (id: string): Promise<Autoridad | null> => {
  return await getDocumentById<Autoridad>('autoridades', id);
};

export const obtenerTodasLasAutoridades = async (): Promise<Autoridad[]> => {
  return await fetchDocuments<Autoridad>('autoridades', '');
};

export const agregarReferenciaAutoridad = async (municipioId: string, autoridadRef: { id: string }): Promise<void> => {
  const municipio = await getDocumentById<Municipio>('municipios', municipioId);
  if (!municipio) throw new Error('Municipio no encontrado');

  const nuevasReferencias = [...(municipio.autoridadesRef || []), autoridadRef];
  await updateDocument('municipios', municipioId, { autoridadesRef: nuevasReferencias });
};