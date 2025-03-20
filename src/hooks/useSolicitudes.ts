import { useState, useEffect } from 'react';
import { fetchDocuments, createDocRef } from '../services/firestoreService';
import { Solicitud } from '../types/Solicitud';
import { Municipio } from '../types/Municipio';
import { normalizaDenominacion } from '../utils/normalizaDenominacion';
import { DocumentReference } from 'firebase/firestore';
import { obtenerSolicitudesPorMunicipio } from '../services/solicitudService';

const useSolicitudes = (denominacion: string) => {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [municipioRef, setMunicipioRef] = useState<DocumentReference | null>(null);
  const [nombreMunicipio, setNombreMunicipio] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const municipios = await fetchDocuments<Municipio>('municipios', '');
        const municipioSeleccionado = municipios.find(
          (m) => normalizaDenominacion(m.denominacion) === normalizaDenominacion(decodeURIComponent(denominacion))
        );

        if (municipioSeleccionado) {
          setNombreMunicipio(municipioSeleccionado.denominacion);
          const ref = createDocRef('municipios', municipioSeleccionado.id);
          setMunicipioRef(ref);

          // Filtrar solicitudes por municipio
          const solicitudesData = await obtenerSolicitudesPorMunicipio(ref);
          setSolicitudes(solicitudesData);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [denominacion]);

  return { solicitudes, loading, municipioRef, nombreMunicipio, setSolicitudes };
};

export default useSolicitudes;