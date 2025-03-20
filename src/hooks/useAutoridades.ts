import { useState, useEffect } from 'react';
import { fetchDocuments, getDocumentById } from '../services/firestoreService';
import { Autoridad } from '../types/Autoridad';
import { Municipio } from '../types/Municipio';
import { DocumentReference } from 'firebase/firestore';
import { normalizaDenominacion } from '../utils/normalizaDenominacion';

const useAutoridades = (denominacion: string) => {
  const [autoridades, setAutoridades] = useState<Autoridad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [municipioId, setMunicipioId] = useState<string>('');
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
          setMunicipioId(municipioSeleccionado.id);

          if (municipioSeleccionado.autoridadesRef?.length) {
            const listaAutoridades = await Promise.all(
              municipioSeleccionado.autoridadesRef.map(async (ref: DocumentReference) => {
                const autoridadDoc = await getDocumentById<Autoridad>('autoridades', ref.id);
                return autoridadDoc ? { ...autoridadDoc, id: ref.id } : null;
              })
            );
            setAutoridades(listaAutoridades.filter(Boolean) as Autoridad[]);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [denominacion]);

  return { autoridades, loading, municipioId, nombreMunicipio, setAutoridades };
};

export default useAutoridades;