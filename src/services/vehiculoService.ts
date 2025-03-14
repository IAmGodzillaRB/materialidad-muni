import { createDocument, updateDocument, deleteDocument, getDocumentById } from './firestoreService';
import { Vehiculo } from '../types/Vehiculo';
import { Municipio } from '../types/Municipio';

export const crearVehiculo = async (Vehiculo: Vehiculo): Promise<string> => {
  return await createDocument('vehiculos', Vehiculo);
};

export const actualizarVehiculo = async (id: string, Vehiculo: Vehiculo): Promise<void> => {
  await updateDocument('vehiculos', id, Vehiculo);
};

export const eliminarVehiculo = async (id: string): Promise<void> => {
  await deleteDocument('vehiculos', id);
};

export const obtenerVehiculoPorId = async (id: string): Promise<Vehiculo | null> => {
  return await getDocumentById<Vehiculo>('vehiculos', id);
};

export const agregarReferenciaVehiculo = async (municipioId: string, VehiculoRef: any): Promise<void> => {
  const municipio = await getDocumentById<Municipio>('municipios', municipioId);
  if (!municipio) {
    throw new Error('No se pudo encontrar el municipio');
  }

  const nuevasReferencias = [...(municipio.vehiculosRef || []), VehiculoRef];
  await updateDocument('municipios', municipioId, { vehiculosRef: nuevasReferencias });
};