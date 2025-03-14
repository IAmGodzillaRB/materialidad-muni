import React from 'react';
import { Input, Row, Col, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import useMunicipios from '../../hooks/useMunicipios';
import MunicipioCard from '../../components/municipioCard/MunicipioCard';
import { normalizaDenominacion } from '../../utils/normalizaDenominacion';

const Municipios: React.FC = () => {
  const navigate = useNavigate();
  const { filteredMunicipios, loading, error, handleSearch } = useMunicipios();

  const handleVerOpciones = (denominacion: string) => {
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

        <Spin spinning={loading} tip="Cargando municipios..." size="large">
          <Row gutter={[16, 16]}>
            {filteredMunicipios.map((municipio) => (
              <Col key={municipio.id} xs={24} sm={16} md={8} lg={6}>
                <MunicipioCard
                  municipio={municipio}
                  onClick={() => handleVerOpciones(municipio.denominacion)}
                />
              </Col>
            ))}
          </Row>
        </Spin>
      </div>
    </div>
  );
};

export default Municipios;