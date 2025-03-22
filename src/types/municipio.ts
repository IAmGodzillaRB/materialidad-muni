import { DocumentReference } from 'firebase/firestore';

export interface Municipio {
  vehiculosRef: DocumentReference[]; // Arreglo de referencias a vehículos
  autoridadesRef: DocumentReference[]; // Arreglo de referencias a autoridades
  id: string;
  rfc: string;
  denominacion: string;
  codigoPostal: string;
  nombreVialidad: string;
  numeroInterior?: string;
  nombreLocalidad: string;
  entidadFederativa: string;
  distrito: string;
  tipoVialidad?: string;
  numeroExterior: string;
  nombreColonia?: string;
  municipio: string;
  entreCalle?: string;
  otraCalle?: string;
  imagenURL?: string;
  fechaCreacion: string;
  eliminado?: boolean;
  hojaMembretadaUrl?: string;
}