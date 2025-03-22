// hooks/useEmpresas.ts
import { useState, useEffect } from 'react';
import { Empresa } from '../types/Empresa';
import { obtenerEmpresas } from '../services/empresaService';

const useEmpresas = () => {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [filteredEmpresas, setFilteredEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const fetchedEmpresas = await obtenerEmpresas(); // Usamos la función del servicio
      setEmpresas(fetchedEmpresas);
      setFilteredEmpresas(fetchedEmpresas);
    } catch (err) {
      setError('Error al cargar las empresas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (value: string) => {
    const normalizedValue = value.toLowerCase().trim();
    const filtered = empresas.filter(emp =>
      emp.razonSocial.toLowerCase().includes(normalizedValue) ||
      emp.rfc.toLowerCase().includes(normalizedValue)
    );
    setFilteredEmpresas(filtered);
  };

  const refetch = async () => {
    await fetchData();
  };

  return { filteredEmpresas, loading, error, handleSearch, refetch };
};

export default useEmpresas;