import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Input, Button, Tooltip, notification, Modal, Form, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { fetchDocuments, createDocument, updateDocument, deleteDocument } from '../../services/firestoreService';
import { normalizaDenominacion } from '../../utils/normalizaDenominacion';

interface Municipio {
  id: string;
  denominacion: string;
  autoridadesRef?: string[];
}

interface Autoridad {
  id?: string;
  nombre: string;
  puesto: string;
  telefono: string;
}

const initialFormData: Autoridad = {
  nombre: '',
  puesto: '',
  telefono: '',
};

const Autoridades: React.FC = () => {
  const { denominacion } = useParams<{ denominacion: string }>();
  const [nombreMunicipio, setNombreMunicipio] = useState<string>('');
  const [municipioId, setMunicipioId] = useState<string>('');
  const [autoridades, setAutoridades] = useState<Autoridad[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingAutoridad, setEditingAutoridad] = useState<Autoridad | null>(null);

  useEffect(() => {
    if (!denominacion) {
      notification.error({ message: 'Error', description: 'No se pudo obtener la denominación del municipio.' });
      return;
    }

    const fetchMunicipioYAutoridades = async () => {
      try {
        const fetchedMunicipios = await fetchDocuments<Municipio>('municipios', '');
        const municipioSeleccionado = fetchedMunicipios.find(
          (m) => normalizaDenominacion(m.denominacion) === normalizaDenominacion(decodeURIComponent(denominacion))
        );

        if (municipioSeleccionado) {
          setNombreMunicipio(municipioSeleccionado.denominacion);
          setMunicipioId(municipioSeleccionado.id);

          if (municipioSeleccionado.autoridadesRef) {
            const autoridadesData = await Promise.all(
              municipioSeleccionado.autoridadesRef.map(async (ref) => {
                const autoridad = await fetchDocuments<Autoridad>('autoridades', ref);
                return { id: ref, ...autoridad[0] };
              })
            );
            setAutoridades(autoridadesData);
          }
        } else {
          notification.warning({ message: 'Advertencia', description: 'El municipio no existe.' });
        }
      } catch (error) {
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
      if (!municipioId) throw new Error('Municipio ID es undefined');

      if (editingAutoridad && editingAutoridad.id) {
        await updateDocument('autoridades', editingAutoridad.id, values);
        notification.success({ message: 'Éxito', description: 'Autoridad actualizada correctamente.' });
      } else {
        const nuevaAutoridadRef = await createDocument('autoridades', values);
        const municipio = await fetchDocuments<Municipio>('municipios', municipioId);
        const nuevasReferencias = [...(municipio[0].autoridadesRef || []), nuevaAutoridadRef];
        await updateDocument('municipios', municipioId, { autoridadesRef: nuevasReferencias });
        notification.success({ message: 'Éxito', description: 'Autoridad creada correctamente.' });
      }

      const municipio = await fetchDocuments<Municipio>('municipios', municipioId);
      const autoridadesData = await Promise.all(
        municipio[0].autoridadesRef!.map(async (ref) => {
          const autoridad = await fetchDocuments<Autoridad>('autoridades', ref);
          return { id: ref, ...autoridad[0] };
        })
      );
      setAutoridades(autoridadesData);
      handleCancel();
    } catch (error) {
      notification.error({ message: 'Error', description: 'Hubo un problema al guardar la autoridad.' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument('autoridades', id);
      const municipio = await fetchDocuments<Municipio>('municipios', municipioId);
      const nuevasReferencias = municipio[0].autoridadesRef!.filter((ref) => ref !== id);
      await updateDocument('municipios', municipioId, { autoridadesRef: nuevasReferencias });
      const autoridadesData = await Promise.all(
        nuevasReferencias.map(async (ref) => {
          const autoridad = await fetchDocuments<Autoridad>('autoridades', ref);
          return { id: ref, ...autoridad[0] };
        })
      );
      setAutoridades(autoridadesData);
      notification.success({ message: 'Éxito', description: 'Autoridad eliminada correctamente.' });
    } catch (error) {
      notification.error({ message: 'Error', description: 'Hubo un problema al eliminar la autoridad.' });
    }
  };

  return (
    <div>
      <h2>Gestión de Autoridades en {nombreMunicipio}</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
        Agregar Autoridad
      </Button>
      <Table dataSource={autoridades} rowKey="id" loading={loading} pagination={{ pageSize: 5 }}>
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
      <Modal title={editingAutoridad ? 'Editar Autoridad' : 'Agregar Autoridad'} visible={isModalVisible} onCancel={handleCancel} onOk={() => form.submit()}>
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
  );
};

export default Autoridades;
