import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spin, Row, Col } from 'antd';
import useMunicipios from '@/hooks/useMunicipios';
import { normalizaDenominacion } from '@/utils/normalizaDenominacion';

const TipoAdquisicion: React.FC = () => {
  const navigate = useNavigate();
  const { denominacion } = useParams<{ denominacion: string }>();
  const { allMunicipios, loading } = useMunicipios();

  const municipio = allMunicipios.find(
    (m) => normalizaDenominacion(m.denominacion) === denominacion
  );

  const acquisitionTypes = [
    {
      title: 'Servicios',
      description: 'Contratación de servicios profesionales, mantenimiento, etc.',
      icon: '🛠️',
      path: 'servicios',
    },
    {
      title: 'Obras',
      description: 'Construcción y mantenimiento de infraestructura.',
      icon: '🏗️',
      path: 'obras',
    },
    {
      title: 'Bienes Muebles',
      description: 'Compra de equipamiento y materiales.',
      icon: '📦',
      path: 'bienes-muebles',
    },
    {
      title: 'Arrendamientos',
      description: 'Renta de inmuebles y maquinaria.',
      icon: '🏢',
      path: 'arrendamientos',
    },
  ];

  const handleCardClick = (path: string) => {
    if (municipio) {
      navigate(
        `/home/municipios/${encodeURIComponent(
          normalizaDenominacion(municipio.denominacion)
        )}/adquisiciones/${path}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
            Tipos de Adquisición -{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {municipio?.denominacion}
            </span>
          </h1>

          <Spin spinning={loading} tip="Cargando datos..." size="large">
            {municipio ? (
              <Row gutter={[24, 24]} justify="center">
                {acquisitionTypes.map((type) => (
                  <Col key={type.path} xs={24} sm={12} md={6}>
                    <div
                      onClick={() => handleCardClick(type.path)}
                      className="h-full bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center text-center cursor-pointer hover:-translate-y-1"
                    >
                      <div className="text-4xl mb-4">{type.icon}</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {type.title}
                      </h3>
                      <p className="text-sm text-gray-600">{type.description}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600 mb-4">No se encontró el municipio</p>
                <img
                  src="/assets/not-found.svg"
                  alt="No encontrado"
                  className="mx-auto max-w-xs"
                />
              </div>
            )}
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default TipoAdquisicion;