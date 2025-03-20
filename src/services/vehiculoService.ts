import { createDocument, updateDocument, deleteDocument, getDocumentById, createDocRef } from './firestoreService';
import { Vehiculo } from '../types/Vehiculo';
import { Municipio } from '../types/Municipio';
import { DocumentReference } from 'firebase/firestore';

export const crearVehiculo = async (vehiculo: Vehiculo): Promise<string> => {
  return await createDocument('vehiculos', vehiculo);
};

export const actualizarVehiculo = async (id: string, vehiculo: Vehiculo): Promise<void> => {
  await updateDocument('vehiculos', id, vehiculo);
};

export const eliminarVehiculo = async (id: string): Promise<void> => {
  await deleteDocument('vehiculos', id);
};

export const obtenerVehiculoPorId = async (id: string): Promise<Vehiculo | null> => {
  return await getDocumentById<Vehiculo>('vehiculos', id);
};

export const agregarReferenciaVehiculo = async (municipioId: string, vehiculoId: string): Promise<void> => {
  const municipio = await getDocumentById<Municipio>('municipios', municipioId);
  if (!municipio) {
    throw new Error('No se pudo encontrar el municipio');
  }
  const vehiculoRef: DocumentReference = createDocRef('vehiculos', vehiculoId); // Crear referencia con tu función
  const nuevasReferencias = [...(municipio.vehiculosRef || []), vehiculoRef];
  await updateDocument('municipios', municipioId, { vehiculosRef: nuevasReferencias });
};