export interface Municipio {
  vehiculosRef: any;
  autoridadesRef: never[];
  id: string;
  rfc: string;
  denominacion: string;
  codigoPostal: string;
  nombreVialidad: string;
  numeroInterior?: string;
  nombreLocalidad: string;
  entidadFederativa: string;
  tipoVialidad?: string;
  numeroExterior: string;
  nombreColonia?: string;
  municipio: string;
  entreCalle?: string;
  otraCalle?: string;
  imagen?: string;
  fechaCreacion: string;
  eliminado?: boolean;
}