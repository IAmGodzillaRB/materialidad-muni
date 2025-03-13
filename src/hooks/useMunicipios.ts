import { useState, useEffect, useCallback } from 'react';
import {
  obtenerMunicipios,
  crearMunicipio,
  actualizarMunicipio,
  eliminarMunicipio,
  eliminarMunicipioDefinitivamente,
} from '../services/municipioService';
import { Municipio } from '../types/Municipio';
import { mostrarError, mostrarExito } from '../utils/notifications';

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

  const handleAddMunicipio = useCallback(async (municipio: Municipio) => {
    try {
      await crearMunicipio(municipio);
      await fetchData();
      mostrarExito('Éxito', 'Municipio creado correctamente.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      mostrarError('Error al crear municipio', errorMessage);
    }
  }, [fetchData]);

  const handleEditMunicipio = useCallback(async (id: string, municipio: Partial<Municipio>) => {
    try {
      await actualizarMunicipio(id, municipio);
      await fetchData();
      mostrarExito('Éxito', 'Municipio actualizado correctamente.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      mostrarError('Error al actualizar municipio', errorMessage);
    }
  }, [fetchData]);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await eliminarMunicipio(id);
      await fetchData();
      mostrarExito('Éxito', 'Municipio movido a la papelera.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      mostrarError('Error al mover a papelera', errorMessage);
    }
  }, [fetchData]);

  const handleDeletePermanently = useCallback(async (id: string) => {
    try {
      await eliminarMunicipioDefinitivamente(id);
      await fetchData();
      mostrarExito('Éxito', 'Municipio eliminado definitivamente.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      mostrarError('Error al eliminar definitivamente', errorMessage);
    }
  }, [fetchData]);

  const handleSearch = useCallback((searchTerm: string) => {
    const filtered = allMunicipios.filter(
      (municipio) =>
        municipio.denominacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        municipio.rfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        municipio.municipio.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMunicipios(filtered);
  }, [allMunicipios]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    allMunicipios,
    filteredMunicipios,
    loading,
    error,
    handleAddMunicipio,
    handleEditMunicipio,
    handleDelete,
    handleDeletePermanently,
    handleSearch,
  };
};

export default useMunicipios;