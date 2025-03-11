import { fetchDocuments } from './firestoreService';
import { Municipio } from '../types/municipio';

export const obtenerMunicipios = async (): Promise<Municipio[]> => {
  const municipios = await fetchDocuments<Municipio>('municipios', '');
  return municipios.filter((municipio) => !municipio.eliminado);
};