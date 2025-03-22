// services/empresaService.ts
import { Empresa } from '../types/Empresa';
import { createDocument, updateDocument, deleteDocument, fetchDocuments, getDocumentById } from './firestoreService';
import { uploadFile } from './storageService';

export const crearEmpresa = async (empresa: Empresa, logo?: File, hojaMembretada?: File): Promise<string> => {
  let logoUrl: string | undefined;
  let hojaMembretadaUrl: string | undefined;

  if (logo) {
    const logoPath = `materialidad/empresas/logos/${Date.now()}-${logo.name}`;
    logoUrl = await uploadFile(logo, logoPath);
  }

  if (hojaMembretada) {
    const hojaPath = `materialidad/empresas/hojas-membretadas/${Date.now()}-${hojaMembretada.name}`;
    hojaMembretadaUrl = await uploadFile(hojaMembretada, hojaPath);
  }

  const empresaData = {
    ...empresa,
    logoUrl,
    hojaMembretadaUrl,
  };

  return await createDocument<Empresa>('empresas', empresaData);
};

export const obtenerEmpresas = async (): Promise<Empresa[]> => {
  const empresas = await fetchDocuments<Empresa>('empresas', '');
  return empresas.filter((empresa) => !empresa.eliminado);
};

export const actualizarEmpresa = async (id: string, empresa: Partial<Empresa>, logo?: File, hojaMembretada?: File): Promise<void> => {
  let logoUrl: string | undefined = empresa.logoUrl;
  let hojaMembretadaUrl: string | undefined = empresa.hojaMembretadaUrl;

  // Subir nuevo logo si se proporciona
  if (logo) {
    const logoPath = `materialidad/empresas/logos/${id}-${Date.now()}-${logo.name}`;
    logoUrl = await uploadFile(logo, logoPath);
  }

  // Subir nueva hoja membretada si se proporciona
  if (hojaMembretada) {
    const hojaPath = `materialidad/empresas/hojas-membretadas/${id}-${Date.now()}-${hojaMembretada.name}`;
    hojaMembretadaUrl = await uploadFile(hojaMembretada, hojaPath);
  }

  const empresaData = {
    ...empresa,
    logoUrl,
    hojaMembretadaUrl,
  };

  await updateDocument('empresas', id, empresaData);
};

export const eliminarEmpresa = async (id: string): Promise<void> => {
  await updateDocument('empresas', id, { eliminado: true });
};

export const eliminarEmpresaDefinitivamente = async (id: string): Promise<void> => {
  await deleteDocument('empresas', id);
};

export const obtenerEmpresaPorId = async (id: string): Promise<Empresa | null> => {
  return await getDocumentById<Empresa>('empresas', id);
};