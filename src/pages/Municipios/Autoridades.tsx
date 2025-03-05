import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDocuments, createDocument, updateDocument, deleteDocument } from '../../services/firestoreService';
import { notification, Spin, Button, Modal, Form, Input, Table } from 'antd';
import { normalizaDenominacion } from '../../utils/normalizaDenominacion';

interface Autoridad {
  id?: string;
  nombre: string;
  puesto: string;
  telefono: string;
}

interface Municipio {
  id: string;
  denominacion: string;
  autoridadesRef?: string[]; // Array de referencias a autoridades
}

const Autoridades: React.FC = () => {
  const { denominacion } = useParams<{ denominacion: string }>(); // Obtener el parámetro de la URL
  const [autoridades, setAutoridades] = useState<Autoridad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingAutoridad, setEditingAutoridad] = useState<Autoridad | null>(null);
  const [nombreMunicipio, setNombreMunicipio] = useState<string>(''); // Estado para el nombre del municipio
  const [form] = Form.useForm();

  // Normalizar la denominación obtenida de la URL
  const denominacionNormalizada = normalizaDenominacion(decodeURIComponent(denominacion || ''));

  // Obtener las autoridades del municipio
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener el municipio correspondiente
        const municipios = await fetchDocuments<Municipio>('municipios', '');
        const municipio = municipios.find(
          (m: Municipio) => normalizaDenominacion(m.denominacion) === denominacionNormalizada
        );

        if (municipio) {
          // Guardar el nombre del municipio en el estado
          setNombreMunicipio(municipio.denominacion);

          if (municipio.autoridadesRef) {
            // Obtener las autoridades referenciadas en el municipio
            const autoridadesFetched = await Promise.all(
              municipio.autoridadesRef.map(async (ref: string) => {
                const autoridad = await fetchDocuments<Autoridad>('autoridades', ref);
                return autoridad;
              })
            );
            setAutoridades(autoridadesFetched.flat());
          }
        } else {
          throw new Error('Municipio no encontrado');
        }
      } catch (error) {
        console.error('Error al cargar autoridades:', error);
        notification.error({
          message: 'Error',
          description: 'No se pudieron cargar las autoridades.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [denominacionNormalizada]);

  // Función para abrir el modal (crear o editar)
  const showModal = (autoridad: Autoridad | null = null) => {
    setEditingAutoridad(autoridad);
    form.setFieldsValue(autoridad || { nombre: '', puesto: '', telefono: '' });
    setIsModalVisible(true);
  };

  // Función para cerrar el modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingAutoridad(null);
  };

  // Función para guardar o actualizar una autoridad
  const handleSave = async (values: Autoridad) => {
    try {
      if (editingAutoridad) {
        // Actualizar autoridad
        await updateDocument<Autoridad>('autoridades', editingAutoridad.id!, values);
        notification.success({
          message: 'Éxito',
          description: 'Autoridad actualizada correctamente.',
        });
      } else {
        // Crear nueva autoridad
        const nuevaAutoridadRef = await createDocument<Autoridad>('autoridades', values);

        // Obtener el municipio correspondiente
        const municipios = await fetchDocuments<Municipio>('municipios', '');
        const municipio = municipios.find(
          (m: Municipio) => normalizaDenominacion(m.denominacion) === denominacionNormalizada
        );

        if (municipio) {
          // Actualizar el municipio para agregar la referencia de la nueva autoridad
          const nuevasReferencias = [...(municipio.autoridadesRef || []), nuevaAutoridadRef];
          await updateDocument('municipios', municipio.id, { autoridadesRef: nuevasReferencias });
        }

        notification.success({
          message: 'Éxito',
          description: 'Autoridad agregada correctamente.',
        });
      }

      // Recargar la lista de autoridades
      const municipios = await fetchDocuments<Municipio>('municipios', '');
      const municipio = municipios.find(
        (m: Municipio) => normalizaDenominacion(m.denominacion) === denominacionNormalizada
      );

      if (municipio && municipio.autoridadesRef) {
        const autoridadesFetched = await Promise.all(
          municipio.autoridadesRef.map(async (ref: string) => {
            const autoridad = await fetchDocuments<Autoridad>('autoridades', ref);
            return autoridad;
          })
        );
        setAutoridades(autoridadesFetched.flat());
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'No se pudo guardar la autoridad.',
      });
    }
  };

  // Función para eliminar una autoridad
  const handleDelete = async (id: string) => {
    try {
      // Eliminar la autoridad
      await deleteDocument('autoridades', id);

      // Obtener el municipio correspondiente
      const municipios = await fetchDocuments<Municipio>('municipios', '');
      const municipio = municipios.find(
        (m: Municipio) => normalizaDenominacion(m.denominacion) === denominacionNormalizada
      );

      if (municipio) {
        // Actualizar el municipio para eliminar la referencia de la autoridad
        const nuevasReferencias = municipio.autoridadesRef?.filter((ref: string) => ref !== id) || [];
        await updateDocument('municipios', municipio.id, { autoridadesRef: nuevasReferencias });
      }

      notification.success({
        message: 'Éxito',
        description: 'Autoridad eliminada correctamente.',
      });

      // Recargar la lista de autoridades
      if (municipio && municipio.autoridadesRef) {
        const autoridadesFetched = await Promise.all(
          municipio.autoridadesRef.map(async (ref: string) => {
            const autoridad = await fetchDocuments<Autoridad>('autoridades', ref);
            return autoridad;
          })
        );
        setAutoridades(autoridadesFetched.flat());
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'No se pudo eliminar la autoridad.',
      });
    }
  };

  // Columnas de la tabla
  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Puesto',
      dataIndex: 'puesto',
      key: 'puesto',
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
    },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_text: string, record: Autoridad) => (
        <span>
          <Button type="link" onClick={() => showModal(record)}>
            Editar
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id!)}>
            Eliminar
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      {/* Mostrar el nombre del municipio en su formato original */}
      <h1 className="text-2xl font-bold mb-4">Autoridades de {nombreMunicipio}</h1>
      <Spin spinning={loading} tip="Cargando autoridades..." size="large">
        {/* Botón para agregar nueva autoridad */}
        <Button type="primary" onClick={() => showModal()} className="mb-4">
          Agregar Autoridad
        </Button>

        {/* Tabla de autoridades */}
        <Table
          dataSource={autoridades}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 5 }}
        />
      </Spin>

      {/* Modal para crear/editar autoridad */}
      <Modal
        title={editingAutoridad ? 'Editar Autoridad' : 'Agregar Autoridad'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSave} layout="vertical">
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
          >
            <Input placeholder="Nombre de la autoridad" />
          </Form.Item>
          <Form.Item
            label="Puesto"
            name="puesto"
            rules={[{ required: true, message: 'Por favor ingresa el puesto' }]}
          >
            <Input placeholder="Puesto de la autoridad" />
          </Form.Item>
          <Form.Item
            label="Teléfono"
            name="telefono"
            rules={[{ required: true, message: 'Por favor ingresa el teléfono' }]}
          >
            <Input placeholder="Teléfono de la autoridad" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingAutoridad ? 'Actualizar' : 'Guardar'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Autoridades;