import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spin, Row, Col } from 'antd';
import useMunicipios from '@/hooks/useMunicipios';
import { normalizaDenominacion } from '@/utils/normalizaDenominacion';

const Servicios: React.FC = () => {
  const navigate = useNavigate();
  const { denominacion } = useParams<{ denominacion: string }>();
  const { allMunicipios, loading } = useMunicipios();

  const municipio = allMunicipios.find(
    (m) => normalizaDenominacion(m.denominacion) === denominacion
  );

  // Datos de ejemplo para servicios (puedes reemplazar con datos reales desde una API o el hook)
  const servicios = [
    {
      id: 1,
      nombre: 'Limpieza de espacios públicos',
      descripcion: 'Servicio de mantenimiento y limpieza de parques y plazas.',
      costoEstimado: '$50,000 MXN',
    },
    {
      id: 2,
      nombre: 'Consultoría administrativa',
      descripcion: 'Asesoría para la gestión municipal.',
      costoEstimado: '$80,000 MXN',
    },
    {
      id: 3,
      nombre: 'Mantenimiento de alumbrado',
      descripcion: 'Reparación y mantenimiento de lámparas públicas.',
      costoEstimado: '$30,000 MXN',
    },
  ];

  const handleBackClick = () => {
    if (municipio) {
      navigate(
        `/home/municipios/${encodeURIComponent(
          normalizaDenominacion(municipio.denominacion)
        )}/tipo-adquisicion`
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8">
            Servicios -{' '}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {municipio?.denominacion}
            </span>
          </h1>

          <Spin spinning={loading} tip="Cargando servicios..." size="large">
            {municipio ? (
              <>
                <Row gutter={[24, 24]} justify="center">
                  {servicios.map((servicio) => (
                    <Col key={servicio.id} xs={24} sm={12} md={8}>
                      <div className="h-full bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col text-left">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {servicio.nombre}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{servicio.descripcion}</p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Costo estimado: </span>
                          {servicio.costoEstimado}
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

export default Servicios;