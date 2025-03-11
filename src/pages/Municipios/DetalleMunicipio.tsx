import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDocuments } from '../../services/firestoreService';
import { Spin, Row, Col, Image } from 'antd';
import { normalizaDenominacion } from '../../utils/normalizaDenominacion'; // Importar la función de normalización
import CardSeccion from '../../components/CardSeccion';

interface Municipio {
  id: string;
  denominacion: string;
  rfc: string;
  direccion: string;
  codigoPostal: string;
  imagen?: string;
}

const DetalleMunicipio: React.FC = () => {
  const { denominacion } = useParams<{ denominacion: string }>();
  const navigate = useNavigate();
  const [municipio, setMunicipio] = useState<Municipio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Obtener los detalles del municipio
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!denominacion) {
          throw new Error('denominacion del municipio no está definido en la URL');
        }

        const fetchedMunicipios = await fetchDocuments('municipios', '');
        const municipios: Municipio[] = fetchedMunicipios.map((doc: any) => ({
          id: doc.id,
          denominacion: doc.denominacion || '',
          rfc: doc.rfc || '',
          direccion: doc.direccion || '',
          codigoPostal: doc.codigoPostal || '',
          imagen: doc.imagen || '',
        }));

        const municipioSeleccionado = municipios.find(
          (m: Municipio) => normalizaDenominacion(m.denominacion) === normalizaDenominacion(decodeURIComponent(denominacion))
        );

        if (municipioSeleccionado) {
          setMunicipio(municipioSeleccionado);
        } else {
          throw new Error('Municipio no encontrado');
        }
      } catch (error) {
        console.error('Error al cargar el municipio:', error);
        navigate('/home/municipios');
      } finally {
        setLoading(false);
      }
    };

    if (denominacion) {
      fetchData();
    } else {
      console.error('El parámetro "denominacion" no está definido en la URL');
      navigate('/home/municipios');
    }
  }, [denominacion, navigate]);

  // Función para manejar el clic en la tarjeta de autoridades
  const handleAutoridadesClick = () => {
    if (municipio) {
      // Navegar a la página de autoridades con la denominación normalizada
      navigate(`/home/municipios/${encodeURIComponent(normalizaDenominacion(municipio.denominacion))}/autoridades`);
    }
  };
  const handleVehiculosClick = () => {
    if (municipio) {
      // Navegar a la página de autoridades con la denominación normalizada
      navigate(`/home/municipios/${encodeURIComponent(normalizaDenominacion(municipio.denominacion))}/vehiculos`);
    }
  }

  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div className="w-full px-6 py-8 flex flex-col h-full bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Detalles del Municipio</h1>
        <Spin spinning={loading} tip="Cargando detalles..." size="large">
          {municipio ? (
            <>
              {/* Logo e información del municipio */}
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
                  <p><strong>Dirección:</strong> {municipio.direccion}</p>
                  <p><strong>Código Postal:</strong> {municipio.codigoPostal}</p>
                </Col>
              </Row>

              {/* Sección de autoridades y vehículos */}
              <div className="mt-6">
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <div onClick={handleAutoridadesClick}>
                      <CardSeccion
                        titulo="Autoridades"
                        imagen="/person.svg"
                      />
                    </div>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <div onClick={handleVehiculosClick}>
                      <CardSeccion
                        titulo="Vehículos"
                        imagen="/car.svg"
                      />
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