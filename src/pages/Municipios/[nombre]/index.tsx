import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDocuments, createDocument } from '../../../services/firestoreService'; // Importa tu servicio
import { notification, Spin, Button, Modal, Form, Input } from 'antd'; // Importar componentes de Ant Design

interface Municipio {
  id: string;
  nombre: string;
  rfc: string;
  direccion: string;
  codigoPostal: string;
}

interface Integrante {
  id?: string; // ID opcional para el documento de Firestore
  nombre: string;
  puesto: string;
  telefono: string;
  municipioId: string; // Asociar el integrante al municipio
}

const DetalleMunicipio: React.FC = () => {
  const { nombre } = useParams<{ nombre: string }>();
  const [municipio, setMunicipio] = useState<Municipio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]); // Estado para la lista de integrantes
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // Estado para controlar el modal
  const [form] = Form.useForm(); // Hook para el formulario

  // Función para desnormalizar el nombre
  const denormalizeName = (normalizedName: string): string => {
    return normalizedName.replace(/-/g, ' '); // Reemplazar guiones con espacios
  };

  // Obtener los detalles del municipio
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedMunicipios = await fetchDocuments('municipios');
        const municipios: Municipio[] = fetchedMunicipios.map((doc: any) => ({
          id: doc.id,
          nombre: doc.nombre || '',
          rfc: doc.rfc || '',
          direccion: doc.direccion || '',
          codigoPostal: doc.codigoPostal || '',
        }));
        const nombreDesnormalizado = denormalizeName(nombre || ''); // Convertir el nombre de la URL a formato original
        const municipioSeleccionado = municipios.find(
          (m: Municipio) => m.nombre.toLowerCase() === nombreDesnormalizado.toLowerCase()
        );

        if (municipioSeleccionado) {
          setMunicipio(municipioSeleccionado);
          fetchIntegrantes(municipioSeleccionado.id); // Obtener los integrantes del municipio
        } else {
          throw new Error('Municipio no encontrado');
        }
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'No se pudo cargar el municipio.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [nombre]);

  // Función para obtener los integrantes del municipio
  const fetchIntegrantes = async (municipioId: string) => {
    try {
      const fetchedIntegrantes = await fetchDocuments('integrantes');
      const integrantesData = fetchedIntegrantes
        .filter((integrante: any) => integrante.municipioId === municipioId) // Filtrar por municipioId
        .map((doc: any) => ({
          id: doc.id,
          nombre: doc.nombre || '',
          puesto: doc.puesto || '',
          telefono: doc.telefono || '',
          municipioId: doc.municipioId || '',
        })) as Integrante[];

      setIntegrantes(integrantesData);
    } catch (error) {
      console.error('Error al obtener integrantes:', error);
    }
  };

  // Función para abrir el modal
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Función para cerrar el modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields(); // Limpiar el formulario
  };

  // Función para guardar el integrante
  const handleAgregarIntegrante = async (values: Integrante) => {
    try {
      if (!municipio) {
        throw new Error('Municipio no encontrado');
      }

      // Guardar el integrante en Firestore
      await createDocument('integrantes', {
        ...values,
        municipioId: municipio.id, // Asociar el integrante al municipio
      });

      notification.success({
        message: 'Éxito',
        description: 'Integrante agregado correctamente.',
      });

      setIsModalVisible(false); // Cerrar el modal
      form.resetFields(); // Limpiar el formulario
      fetchIntegrantes(municipio.id); // Actualizar la lista de integrantes
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'No se pudo agregar el integrante.',
      });
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Detalles del Municipio</h1>
      {/* Mostrar spinner mientras se cargan los datos */}
      <Spin spinning={loading} tip="Cargando detalles..." size="large">
        {municipio ? (
          <>
            <p><strong>Nombre:</strong> {municipio.nombre}</p>
            <p><strong>RFC:</strong> {municipio.rfc}</p>
            <p><strong>Dirección:</strong> {municipio.direccion}</p>
            <p><strong>Código Postal:</strong> {municipio.codigoPostal}</p>

            {/* Botón para agregar integrantes */}
            <Button type="primary" onClick={showModal} className="mt-4">
              Agregar Integrante
            </Button>

            {/* Lista de integrantes */}
            <div className="mt-6">
              <h2 className="text-xl font-bold mb-4">Integrantes</h2>
              {integrantes.length > 0 ? (
                integrantes.map((integrante) => (
                  <div key={integrante.id} className="mb-4 p-4 border rounded-lg">
                    <p><strong>Nombre:</strong> {integrante.nombre}</p>
                    <p><strong>Puesto:</strong> {integrante.puesto}</p>
                    <p><strong>Teléfono:</strong> {integrante.telefono}</p>
                  </div>
                ))
              ) : (
                <p>No hay integrantes registrados.</p>
              )}
            </div>
          </>
        ) : (
          <div>Municipio no encontrado</div>
        )}
      </Spin>

      {/* Modal para agregar integrantes */}
      <Modal
        title="Agregar Integrante"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null} // Ocultar los botones por defecto del modal
      >
        <Form form={form} onFinish={handleAgregarIntegrante} layout="vertical">
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
          >
            <Input placeholder="Nombre del integrante" />
          </Form.Item>
          <Form.Item
            label="Puesto"
            name="puesto"
            rules={[{ required: true, message: 'Por favor ingresa el puesto' }]}
          >
            <Input placeholder="Puesto del integrante" />
          </Form.Item>
          <Form.Item
            label="Teléfono"
            name="telefono"
            rules={[{ required: true, message: 'Por favor ingresa el teléfono' }]}
          >
            <Input placeholder="Teléfono del integrante" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DetalleMunicipio;