import { useState, useEffect } from 'react';
import { obtenerMunicipios } from '../services/municipioService';
import { Municipio } from '../types/municipio';
import { mostrarError } from '../utils/notifications';

const useMunicipios = () => {
  const [allMunicipios, setAllMunicipios] = useState<Municipio[]>([]);
  const [filteredMunicipios, setFilteredMunicipios] = useState<Municipio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const municipios = await obtenerMunicipios();
        setAllMunicipios(municipios);
        setFilteredMunicipios(municipios);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setError(errorMessage);
        mostrarError('Error al cargar municipios', errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (searchTerm: string) => {
    const filtered = allMunicipios.filter(
      (municipio) =>
        municipio.denominacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        municipio.rfc.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMunicipios(filtered);
  };

  return { allMunicipios, filteredMunicipios, loading, error, handleSearch };
};

export default useMunicipios;