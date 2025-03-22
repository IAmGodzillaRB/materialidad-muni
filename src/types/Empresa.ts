// types/Empresa.ts
export interface Empresa {
    id: string;
    razonSocial: string;
    rfc: string;
    logoUrl?: string; // URL del logo en Storage
    hojaMembretadaUrl?: string; // URL del documento .docx en Storage
    fechaCreacion: string;
    eliminado?: boolean;
  }