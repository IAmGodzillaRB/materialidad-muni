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

  // Categorías con sus nombres, URLs y SVGs correspondientes
  const categorias = [
    {
      id: 1,
      nombre: 'Solicitudes',
      url: 'solicitudes',
      svg: (
        <svg
          className="w-8 h-8 mb-2 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      ),
    },
    {
      id: 2,
      nombre: 'Cotizaciones',
      url: 'cotizaciones',
      svg: (
        <svg
          className="w-8 h-8 mb-2 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      nombre: 'Aprobados',
      url: 'aprobados',
      svg: (
        <svg
          className="w-8 h-8 mb-2 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
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

  const handleCategoryClick = (url: string) => {
    if (municipio) {
      navigate(
        `/home/municipios/${encodeURIComponent(
          normalizaDenominacion(municipio.denominacion)
        )}/adquisiciones/servicios/${url}`
      );
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full mx-auto h-full flex flex-col">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 flex flex-col h-full">
          <button
            onClick={handleBackClick}
            className="flex hover:shadow-xl items-center text-sm underline transition-colors duration-200 self-start mb-4 sm:mb-0 sm:mr-auto focus:outline-none cursor-pointer"
            style={{ color: '#2563eb', textDecoration: 'underline' }} // Equivalente a blue-600
            onMouseEnter={(e) => (e.currentTarget.style.color = '#1e40af')} // Equivalente a blue-800
            onMouseLeave={(e) => (e.currentTarget.style.color = '#2563eb')} // Vuelve a blue-600
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Volver
          </button>
          {/* Botón "Volver" y título */}
          <div className="flex flex-col sm:flex-row items-center justify-center mb-8">

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
                Servicios -{' '}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {municipio?.denominacion}
                </span>
              </h1>
            </div>
          </div>

          <Spin spinning={loading} tip="Cargando servicios..." size="large" className="flex-grow">
            {municipio ? (
              <div className="flex flex-col h-full">
                {/* Tarjetas que ocupan el espacio disponible */}
                <Row gutter={[24, 24]} className="flex-grow">
                  {categorias.map((categoria) => (
                    <Col key={categoria.id} xs={24} sm={8} className="h-full">
                      <div
                        onClick={() => handleCategoryClick(categoria.url)}
                        className="h-full bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50"
                      >
                        {categoria.svg}
                        <h3 className="text-xl font-semibold text-gray-800 text-center">
                          {categoria.nombre}
                        </h3>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
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