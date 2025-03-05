export const normalizaDenominacion = (denominacion: string): string => {
    return denominacion
      .toLowerCase()
      .normalize('NFD') // Descompone caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Elimina las tildes
      .replace(/[^a-z0-9]/g, '-') // Reemplaza caracteres no alfanuméricos con "-"
      .replace(/-+/g, '-') // Reemplaza múltiples "-" por uno solo
      .trim();
  };
  