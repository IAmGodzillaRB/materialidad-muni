import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Tooltip, notification, Modal, Form, Space, Spin, Input } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { crearAutoridad, actualizarAutoridad, eliminarAutoridad, obtenerAutoridadPorId, agregarReferenciaAutoridad} from '../../services/autoridadService'; // Importa tus servicios de autoridades
import { actualizarMunicipio, obtenerMunicipioPorId, obtenerMunicipios } from '../../services/municipioService'; 
import { normalizaDenominacion } from '../../utils/normalizaDenominacion';
import { Autoridad } from '../../types/Autoridad'; 

const initialFormData: Autoridad = {
  nombre: '',
  puesto: '',
  telefono: '',
};

const Autoridades: React.FC = () => {
  const { denominacion } = useParams<{ denominacion: string }>();
  const [nombreMunicipio, setNombreMunicipio] = useState<string>('');
  const [id, setid] = useState<string>('');
  const [autoridades, setAutoridades] = useState<Autoridad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingAutoridad, setEditingAutoridad] = useState<Autoridad | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!denominacion) {
      notification.error({ message: 'Error', description: 'No se pudo obtener la denominación del municipio.' });
      return;
    }

    const fetchMunicipioYAutoridades = async () => {
      try {
        const municipios = await obtenerMunicipios(); // Usa tu servicio para obtener municipios
        const municipioSeleccionado = municipios.find(
          (m) => normalizaDenominacion(m.denominacion) === normalizaDenominacion(decodeURIComponent(denominacion))
        );

        if (municipioSeleccionado) {
          setNombreMunicipio(municipioSeleccionado.denominacion);
          setid(municipioSeleccionado.id);

          if (municipioSeleccionado.autoridadesRef && municipioSeleccionado.autoridadesRef.length > 0) {
            const listaAutoridades: Autoridad[] = [];

            for (const ref of municipioSeleccionado.autoridadesRef as Array<{ id: string } | string>) {
              try {
                const autoridadId = typeof ref === 'string' ? ref : ref.id;
                const autoridadDoc = await obtenerAutoridadPorId(autoridadId); // Usa tu servicio para obtener autoridades

                if (autoridadDoc) {
                  listaAutoridades.push({ ...autoridadDoc, id: autoridadId });
                }
              } catch (error) {
                console.error('Error al procesar autoridad:', error);
              }
            }

            setAutoridades(listaAutoridades);
          } else {
            setAutoridades([]);
          }
        } else {
          notification.warning({ message: 'Advertencia', description: 'El municipio no existe.' });
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        notification.error({ message: 'Error', description: 'No se pudo cargar la información del municipio.' });
      } finally {
        setLoading(false);
      }
    };

    fetchMunicipioYAutoridades();
  }, [denominacion]);

  const showModal = (autoridad: Autoridad | null = null) => {
    setEditingAutoridad(autoridad);
    form.setFieldsValue(autoridad || initialFormData);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingAutoridad(null);
    form.resetFields();
  };

  const handleSave = async (values: Autoridad) => {
    try {
      if (!id) throw new Error('Municipio ID es undefined');

      if (editingAutoridad && editingAutoridad.id) {
        await actualizarAutoridad(editingAutoridad.id, values); // Usa tu servicio para actualizar autoridades
        setAutoridades(prevAutoridades =>
          prevAutoridades.map(auth =>
            auth.id === editingAutoridad.id ? { ...values, id: editingAutoridad.id } : auth
          )
        );
        notification.success({ message: 'Éxito', description: 'Autoridad actualizada correctamente.' });
      } else {
        const nuevaAutoridadId = await crearAutoridad(values); // Usa tu servicio para crear autoridades
        const autoridadRef = { id: nuevaAutoridadId }; // Crear una referencia simple
        await agregarReferenciaAutoridad(id, autoridadRef); // Usa tu servicio para agregar referencias

        setAutoridades(prevAutoridades => [...prevAutoridades, { ...values, id: nuevaAutoridadId }]);
        notification.success({ message: 'Éxito', description: 'Autoridad creada correctamente.' });
      }

      handleCancel();
    } catch (error) {
      console.error('Error al guardar autoridad:', error);
      notification.error({ message: 'Error', description: 'Hubo un problema al guardar la autoridad.' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarAutoridad(id); // Usa tu servicio para eliminar autoridades
      const municipio = await obtenerMunicipioPorId(id); // Usa tu servicio para obtener el municipio

      if (municipio) {
        const nuevasReferencias = municipio.autoridadesRef?.filter(ref =>
          (typeof ref === 'string' ? ref : (ref as { id: string }).id) !== id
        ) || [];
        await actualizarMunicipio(id, { autoridadesRef: nuevasReferencias });
      }

      setAutoridades(prevAutoridades => prevAutoridades.filter(auth => auth.id !== id));
      notification.success({ message: 'Éxito', description: 'Autoridad eliminada correctamente.' });
    } catch (error) {
      console.error('Error al eliminar autoridad:', error);
      notification.error({ message: 'Error', description: 'Hubo un problema al eliminar la autoridad.' });
    }
  };

  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div className="w-full px-6 py-8 flex flex-col h-full bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Gestión de Autoridades en {nombreMunicipio}</h1>
        <Spin spinning={loading} tip="Cargando autoridades..." size="large">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
            style={{ marginBottom: 16 }}
          >
            Agregar Autoridad
          </Button>

          <Table
            dataSource={autoridades}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: 'No hay autoridades registradas' }}
          >
            <Table.Column title="Nombre" dataIndex="nombre" key="nombre" />
            <Table.Column title="Puesto" dataIndex="puesto" key="puesto" />
            <Table.Column title="Teléfono" dataIndex="telefono" key="telefono" />
            <Table.Column
              title="Acciones"
              key="acciones"
              render={(_, record: Autoridad) => (
                <Space>
                  <Tooltip title="Editar">
                    <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
                  </Tooltip>
                  <Tooltip title="Eliminar">
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id!)} />
                  </Tooltip>
                </Space>
              )}
            />
          </Table>
        </Spin>

        <Modal
          title={editingAutoridad ? 'Editar Autoridad' : 'Agregar Autoridad'}
          open={isModalVisible}
          onCancel={handleCancel}
          onOk={() => form.submit()}
        >
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Campo requerido' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="puesto" label="Puesto" rules={[{ required: true, message: 'Campo requerido' }]}>
              <Input />
            </Form.Item>
            <Form.Item name="telefono" label="Teléfono">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Autoridades;