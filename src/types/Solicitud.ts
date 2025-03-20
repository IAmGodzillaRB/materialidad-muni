import { DocumentReference } from 'firebase/firestore';

export interface Solicitud {
  id?: string;
  descripcion: string;
  fechaCreacion: string;
  estado: 'Pendiente' | 'En Proceso' | 'Completada';
  solicitante: string;
  municipioId: DocumentReference;
  eliminado: boolean;
  fecha: string;
}