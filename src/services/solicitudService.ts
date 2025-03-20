import { createDocument, updateDocument, deleteDocument, getDocumentById, fetchDocuments } from './firestoreService';
import { Solicitud } from '../types/Solicitud';
import { DocumentReference } from 'firebase/firestore';

export const crearSolicitud = async (solicitud: Solicitud): Promise<string> => {
  return await createDocument('solicitudes', solicitud);
};

export const actualizarSolicitud = async (id: string, solicitud: Solicitud): Promise<void> => {
  await updateDocument('solicitudes', id, solicitud);
};

export const eliminarSolicitud = async (id: string): Promise<void> => {
  await deleteDocument('solicitudes', id);
};

export const obtenerSolicitudPorId = async (id: string): Promise<Solicitud | null> => {
  return await getDocumentById<Solicitud>('solicitudes', id);
};

export const obtenerTodasLasSolicitudes = async (): Promise<Solicitud[]> => {
  return await fetchDocuments<Solicitud>('solicitudes', '');
};

// Nueva función para filtrar solicitudes por municipio
export const obtenerSolicitudesPorMunicipio = async (municipioRef: DocumentReference): Promise<Solicitud[]> => {
  const todasSolicitudes = await fetchDocuments<Solicitud>('solicitudes', '');
  return todasSolicitudes.filter(solicitud => solicitud.municipioId.id === municipioRef.id);
};