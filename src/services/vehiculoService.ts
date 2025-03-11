import { createDocument, updateDocument, deleteDocument } from './firestoreService';
import { Vehiculo } from '../types/vehiculo';

export const crearVehiculo = async (vehiculo: Vehiculo) => {
  return await createDocument('vehiculos', vehiculo);
};

export const actualizarVehiculo = async (id: string, vehiculo: Vehiculo) => {
  return await updateDocument('vehiculos', id, vehiculo);
};

export const eliminarVehiculo = async (id: string) => {
  return await deleteDocument('vehiculos', id);
};