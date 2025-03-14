import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Spin, Row, Col } from 'antd';
import useMunicipios from '@/hooks/useMunicipios'; // Alias @/
import { normalizaDenominacion } from '@/utils/normalizaDenominacion'; // Alias @/
import CardSeccion from '@/components/CardSeccion/CardSeccion'; // Alias @/
import './OpcionesMunicipio.css';

const OpcionesMunicipio: React.FC = () => {
  const navigate = useNavigate();
  const { denominacion } = useParams<{ denominacion: string }>();
  const { allMunicipios, loading } = useMunicipios();

  const municipio = allMunicipios.find(
    m => normalizaDenominacion(m.denominacion) === denominacion
  );

  const handleTipoAdquisicionClick = () => {
    if (municipio) {
      navigate(`/home/municipios/${encodeURIComponent(normalizaDenominacion(municipio.denominacion))}/adquisiciones`);
    }
  };

  const handleCosasMunicipioClick = () => {
    if (municipio) {
      navigate(`/home/municipios/${encodeURIComponent(normalizaDenominacion(municipio.denominacion))}/detalles-municipio`);
    }
  };

  return (
    <div className="opciones-municipio-container">
      <h1 className="title">
        Municipio de <span className="title-highlight">{municipio?.denominacion}</span>
      </h1>
      <Spin
        spinning={loading}
        tip="Cargando datos..."
        size="large"
        className="custom-spin"
      >
        {municipio ? (
          <Row gutter={[24, 24]} justify="center" className="cards-row">
            <Col xs={24} sm={12} lg={12}>
              <div className="card-wrapper" onClick={handleTipoAdquisicionClick}>
                <CardSeccion
                  titulo="Adquisiciones"
                  imagen="/assets/adquisicion.svg"
                  className="card-adquisicion"
                />
              </div>
            </Col>
            <Col xs={24} sm={12} lg={12}>
              <div className="card-wrapper" onClick={handleCosasMunicipioClick}>
                <CardSeccion
                  titulo="Detalles del Municipio"
                  imagen="/assets/municipio.svg"
                  className="card-detalles"
                />
              </div>
            </Col>
          </Row>
        ) : (
          <div className="not-found">
            <p>No se encontró el municipio</p>
            <img src="/assets/not-found.svg" alt="No encontrado" className="not-found-img" />
          </div>
        )}
      </Spin>
    </div>
  );
};

export default OpcionesMunicipio;