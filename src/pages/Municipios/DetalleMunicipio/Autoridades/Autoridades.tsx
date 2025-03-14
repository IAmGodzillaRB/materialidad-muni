import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Tooltip, notification, Space, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import useAutoridades from '../../../../hooks/useAutoridades';
import { crearAutoridad, actualizarAutoridad, eliminarAutoridad } from '../../../../services/autoridadService';
import AutoridadModal from '../../../../components/modals/AutoridadModal';
import { Autoridad } from '../../../../types/Autoridad';

const Autoridades: React.FC = () => {
  const { denominacion } = useParams<{ denominacion: string }>();
  const { autoridades, loading, nombreMunicipio, setAutoridades } = useAutoridades(denominacion || '');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingAutoridad, setEditingAutoridad] = useState<Autoridad | null>(null);

  const showModal = (autoridad: Autoridad | null = null) => {
    setEditingAutoridad(autoridad);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingAutoridad(null);
  };

  const handleSave = async (values: Autoridad) => {
    try {
      if (editingAutoridad && editingAutoridad.id) {
        await actualizarAutoridad(editingAutoridad.id, values);
        setAutoridades(prev => prev.map(auth => (auth.id === editingAutoridad.id ? { ...values, id: editingAutoridad.id } : auth)));
        notification.success({ message: 'Autoridad actualizada correctamente.' });
      } else {
        const nuevaAutoridadId = await crearAutoridad(values);
        setAutoridades(prev => [...prev, { ...values, id: nuevaAutoridadId }]);
        notification.success({ message: 'Autoridad creada correctamente.' });
      }
      handleCancel();
    } catch (error) {
      console.error('Error al guardar autoridad:', error);
      notification.error({ message: 'Error al guardar la autoridad.' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarAutoridad(id);
      setAutoridades(prev => prev.filter(auth => auth.id !== id));
      notification.success({ message: 'Autoridad eliminada correctamente.' });
    } catch (error) {
      console.error('Error al eliminar autoridad:', error);
      notification.error({ message: 'Error al eliminar la autoridad.' });
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

        <AutoridadModal
          visible={isModalVisible}
          onCancel={handleCancel}
          onSave={handleSave}
          initialValues={editingAutoridad}
        />
      </div>
    </div>
  );
};

export default Autoridades;