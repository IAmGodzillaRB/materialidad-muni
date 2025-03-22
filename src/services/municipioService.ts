import { Municipio } from '../types/Municipio';
import { createDocument, updateDocument, deleteDocument, fetchDocuments, getDocumentById } from './firestoreService';
import { uploadFile } from './storageService';

export const crearMunicipio = async (municipio: Municipio, imagen?: File, hojaMembretada?: File): Promise<string> => {
  let imagenURL: string | undefined;
  let hojaMembretadaUrl: string | undefined;
  
  if (imagen) {
    const imagenPath = `materialidad/municipios/imagenes/${Date.now()}-${imagen.name}`;
    imagenURL = await uploadFile(imagen, imagenPath);
  }
  
  if (hojaMembretada) {
    const hojaPath = `materialidad/municipios/hojas-membretadas/${Date.now()}-${hojaMembretada.name}`;
    hojaMembretadaUrl = await uploadFile(hojaMembretada, hojaPath);
  }
  
  const municipioData = {
    ...municipio,
    imagenURL,
    hojaMembretadaUrl,
  };
  
  return await createDocument<Municipio>('municipios', municipioData);
};

export const obtenerMunicipios = async (): Promise<Municipio[]> => {
  const municipios = await fetchDocuments<Municipio>('municipios', '');
  return municipios.filter((municipio) => !municipio.eliminado);
};

export const actualizarMunicipio = async (id: string, municipio: Partial<Municipio>, imagen?: File, hojaMembretada?: File): Promise<void> => {
  let imagenURL: string | undefined = municipio.imagenURL;
  let hojaMembretadaUrl: string | undefined = municipio.hojaMembretadaUrl;
  
  // Subir nueva imagen si se proporciona
  if (imagen) {
    const imagenPath = `materialidad/municipios/imagenes/${id}-${Date.now()}-${imagen.name}`;
    imagenURL = await uploadFile(imagen, imagenPath);
  }
  
  // Subir nueva hoja membretada si se proporciona
  if (hojaMembretada) {
    const hojaPath = `materialidad/municipios/hojas-membretadas/${id}-${Date.now()}-${hojaMembretada.name}`;
    hojaMembretadaUrl = await uploadFile(hojaMembretada, hojaPath);
  }
  
  const municipioData = {
    ...municipio,
    imagenURL,
    hojaMembretadaUrl,
  };
  
  await updateDocument('municipios', id, municipioData);
};

export const eliminarMunicipio = async (id: string): Promise<void> => {
  await updateDocument('municipios', id, { eliminado: true });
};

export const eliminarMunicipioDefinitivamente = async (id: string): Promise<void> => {
  await deleteDocument('municipios', id);
};

export const obtenerMunicipioPorId = async (id: string): Promise<Municipio | null> => {
  return await getDocumentById<Municipio>('municipios', id);
};