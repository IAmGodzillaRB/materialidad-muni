import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spin, Row, Col } from 'antd';
import useMunicipios from '@/hooks/useMunicipios';
import { normalizaDenominacion } from '@/utils/normalizaDenominacion';

const Obras: React.FC = () => {
  const navigate = useNavigate();
  const { denominacion } = useParams<{ denominacion: string }>();
  const { allMunicipios, loading } = useMunicipios();

  const municipio = allMunicipios.find(
    (m) => normalizaDenominacion(m.denominacion) === denominacion
  );

  // Datos de ejemplo para obras públicas (puedes reemplazar con datos reales)
  const obrasPublicas = [
    {
      id: 1,
      nombre: 'Pavimentación de Calle Principal',
      descripcion: 'Reconstrucción de 2 km de calle con concreto hidráulico.',
      costoEstimado: '$1,200,000 MXN',
      estado: 'En progreso',
    },
    {
      id: 2,
      nombre: 'Rehabilitación de Escuela Primaria',
      descripcion: 'Remodelación de aulas y áreas recreativas.',
      costoEstimado: '$800,000 MXN',
      estado: 'Completada',
    },
    {
      id: 3,
      nombre: 'Sistema de Agua Potable',
      descripcion: 'Instalación de tuberías y tanque de almacenamiento.',
      costoEstimado: '$2,500,000 MXN',
      estado: 'Planeada',
    },
  ];

  const handleBackClick = () => {
    if (municipio) {
      navigate(
        `/home/municipios/${encodeURIComponent(
          normalizaDenominacion(municipio.denominacion)
        )}/adquisiciones`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
            Obra Pública -{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {municipio?.denominacion}
            </span>
          </h1>

          <Spin spinning={loading} tip="Cargando obras públicas..." size="large">
            {municipio ? (
              <>
                <Row gutter={[24, 24]} justify="center">
                  {obrasPublicas.map((obra) => (
                    <Col key={obra.id} xs={24} sm={12} md={8}>
                      <div className="h-full bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col text-left">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {obra.nombre}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{obra.descripcion}</p>
                        <p className="text-sm text-gray-500 mb-1">
                          <span className="font-medium">Costo estimado: </span>
                          {obra.costoEstimado}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Estado: </span>
                          <span
                            className={`${
                              obra.estado === 'En progreso'
                                ? 'text-yellow-600'
                                : obra.estado === 'Completada'
                                ? 'text-green-600'
                                : 'text-gray-600'
                            } font-semibold`}
                          >
                            {obra.estado}
                          </span>
                        </p>
                      </div>
                    </Col>
                  ))}
                </Row>
                <div className="mt-8 text-center">
                  <button
                    onClick={handleBackClick}
                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Volver a Tipos de Adquisición
                  </button>
                </div>
              </>
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

export default Obras;