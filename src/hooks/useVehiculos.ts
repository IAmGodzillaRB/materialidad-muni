import { useState, useEffect } from 'react';
import { fetchDocuments, getDocumentById } from '../services/firestoreService';
import { Vehiculo } from '../types/Vehiculo';
import { Municipio } from '../types/Municipio';
import { DocumentReference } from 'firebase/firestore';
import { normalizaDenominacion } from '../utils/normalizaDenominacion';

const useVehiculos = (denominacion: string) => {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [municipioId, setMunicipioId] = useState<string>('');
  const [nombreMunicipio, setNombreMunicipio] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedMunicipios = await fetchDocuments<Municipio>('municipios', '');
        const municipioSeleccionado = fetchedMunicipios.find(
          (m) => normalizaDenominacion(m.denominacion) === normalizaDenominacion(decodeURIComponent(denominacion))
        );

        if (municipioSeleccionado) {
          setNombreMunicipio(municipioSeleccionado.denominacion);
          setMunicipioId(municipioSeleccionado.id);

          if (municipioSeleccionado.vehiculosRef?.length) {
            const listaVehiculos = await Promise.all(
              municipioSeleccionado.vehiculosRef.map(async (ref: DocumentReference) => {
                const vehiculoDoc = await getDocumentById<Vehiculo>('vehiculos', ref.id);
                return vehiculoDoc ? { ...vehiculoDoc, id: ref.id } : null;
              })
            );
            setVehiculos(listaVehiculos.filter(Boolean) as Vehiculo[]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [denominacion]);

  return { vehiculos, loading, municipioId, nombreMunicipio, setVehiculos };
};

export default useVehiculos;