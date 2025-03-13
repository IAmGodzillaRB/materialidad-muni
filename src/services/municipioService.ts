import { fetchDocuments, createDocument, updateDocument, deleteDocument, getDocumentById } from './firestoreService';
import { Municipio } from '../types/Municipio';

export const obtenerMunicipios = async (): Promise<Municipio[]> => {
  const municipios = await fetchDocuments<Municipio>('municipios', '');
  return municipios.filter((municipio) => !municipio.eliminado);
};

export const crearMunicipio = async (municipio: Municipio): Promise<string> => {
  return await createDocument<Municipio>('municipios', municipio);
};

export const actualizarMunicipio = async (id: string, municipio: Partial<Municipio>): Promise<void> => {
  await updateDocument<Municipio>('municipios', id, municipio);
};

export const eliminarMunicipio = async (id: string): Promise<void> => {
  await updateDocument<Municipio>('municipios', id, { eliminado: true });
};

export const obtenerMunicipioPorId = async (id: string): Promise<Municipio | null> => {
  return await getDocumentById<Municipio>('municipios', id);
};

export const eliminarMunicipioDefinitivamente = async (id: string) => {
  return await deleteDocument('municipios', id);
};