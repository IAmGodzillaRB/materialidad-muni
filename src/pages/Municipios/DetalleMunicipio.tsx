import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spin, Row, Col, Image } from 'antd';
import useMunicipios from '../../hooks/useMunicipios';
import { normalizaDenominacion } from '../../utils/normalizaDenominacion';
import CardSeccion from '../../components/CardSeccion/CardSeccion';

const DetalleMunicipio: React.FC = () => {
  const navigate = useNavigate();
  const { denominacion } = useParams(); 
  const { allMunicipios, loading } = useMunicipios();
  
  const municipio = allMunicipios.find(
    m => normalizaDenominacion(m.denominacion) === denominacion
  );

  const handleAutoridadesClick = () => {
    if (municipio) {
      navigate(`/home/municipios/${encodeURIComponent(normalizaDenominacion(municipio.denominacion))}/autoridades`);
    }
  };

  const handleVehiculosClick = () => {
    if (municipio) {
      navigate(`/home/municipios/${encodeURIComponent(normalizaDenominacion(municipio.denominacion))}/vehiculos`);
    }
  };

  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div className="w-full px-6 py-8 flex flex-col h-full bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Detalles del Municipio</h1>
        <Spin spinning={loading} tip="Cargando detalles..." size="large">
          {municipio ? (
            <>
              <Row gutter={[16, 16]}>
                <Col span={6}>
                  <Image
                    src={municipio.imagen || '/placeholder-municipio.png'}
                    alt={`Logo de ${municipio.denominacion}`}
                    width={150}
                    height={150}
                    style={{ objectFit: 'cover' }}
                  />
                </Col>
                <Col span={18}>
                  <p><strong>Denominación:</strong> {municipio.denominacion}</p>
                  <p><strong>RFC:</strong> {municipio.rfc}</p>
                  <p><strong>Dirección:</strong> {municipio.nombreVialidad}</p>
                  <p><strong>Código Postal:</strong> {municipio.codigoPostal}</p>
                </Col>
              </Row>
              
              {/* Sección de autoridades y vehículos */}
              <div className="mt-6">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <div onClick={handleAutoridadesClick}>
                      <CardSeccion titulo="Autoridades" imagen="/person.svg" />
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <div onClick={handleVehiculosClick}>
                      <CardSeccion titulo="Vehículos" imagen="/car.svg" />
                    </div>
                  </Col>
                </Row>
              </div>
            </>
          ) : (
            <div>Municipio no encontrado</div>
          )}
        </Spin>
      </div>
    </div>
  );
};

export default DetalleMunicipio;