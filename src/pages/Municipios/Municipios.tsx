import React, { useState, useEffect } from 'react';
import { Input, Card, Row, Col, notification, Spin, Image } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchDocuments } from '../../services/firestoreService';
import { normalizaDenominacion } from '../../utils/normalizaDenominacion';

interface Municipio {
  id: string;
  denominacion: string;
  rfc: string;
  direccion: string;
  codigoPostal: string;
  imagen?: string;
  eliminado?: boolean;
}

const Municipios: React.FC = () => {
  const [allMunicipios, setAllMunicipios] = useState<Municipio[]>([]);
  const [filteredMunicipios, setFilteredMunicipios] = useState<Municipio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Obtener todos los municipios
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const municipios = await fetchDocuments<Municipio>('municipios', '') as Municipio[];
      const municipiosActivos = municipios.filter(municipio => !municipio.eliminado);
      setAllMunicipios(municipiosActivos);
      setFilteredMunicipios(municipiosActivos);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      showNotification('error', 'Error al cargar municipios', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Función para mostrar notificaciones
  const showNotification = (type: 'success' | 'error', message: string, description?: string) => {
    notification[type]({
      message,
      description,
    });
  };

  // Función para buscar municipios
  const handleSearch = (searchTerm: string) => {
    const filtered = allMunicipios.filter(
      (municipio) =>
        municipio.denominacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        municipio.rfc.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMunicipios(filtered);
  };

  // Navegar a la página de detalles del municipio
  const handleVerDetalles = (denominacion: string) => {
    navigate(`/home/municipios/${encodeURIComponent(normalizaDenominacion(denominacion))}`);
  };
  
  

  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div className="w-full px-6 py-8 flex flex-col h-full bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-800">Municipios</h2>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <Input
            placeholder="Buscar por denominacion o RFC"
            className="w-full md:w-1/3"
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Buscar municipios por denominacion o RFC"
            style={{ maxWidth: '400px' }}
          />
        </div>

        {/* Mostrar spinner mientras se cargan los datos */}
        <Spin spinning={loading} tip="Cargando municipios..." size="large">
          <Row gutter={[16, 16]}>
            {filteredMunicipios.map((municipio) => (
              <Col key={municipio.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={
                    <Image
                      src={municipio.imagen || 'https://via.placeholder.com/150'}
                      alt={municipio.denominacion}
                      height={150}
                      style={{ objectFit: 'cover' }}
                      preview={false}
                    />
                  }
                  className="shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                  onClick={() => handleVerDetalles(municipio.denominacion)} // Navegar al hacer clic
                >
                  <Card.Meta
                    title={municipio.denominacion}
                    description={
                      <div>
                        <p><strong>RFC:</strong> {municipio.rfc}</p>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </Spin>
      </div>
    </div>
  );
};

export default Municipios;