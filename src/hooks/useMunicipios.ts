import { useState, useEffect, useCallback } from 'react';
import { obtenerMunicipios } from '../services/municipioService';
import { Municipio } from '../types/Municipio';
import { mostrarError } from '../utils/notifications';

const useMunicipios = () => {
  const [allMunicipios, setAllMunicipios] = useState<Municipio[]>([]);
  const [filteredMunicipios, setFilteredMunicipios] = useState<Municipio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

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
  }, []);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      const filtered = allMunicipios.filter(
        (municipio) =>
          municipio.denominacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
          municipio.rfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
          municipio.municipio.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMunicipios(filtered);
    },
    [allMunicipios]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    allMunicipios,
    filteredMunicipios,
    loading,
    error,
    handleSearch,
    refetch: fetchData,
  };
};

export default useMunicipios;