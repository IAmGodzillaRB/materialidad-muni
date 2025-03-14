import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Tooltip, notification, Space, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import useVehiculos from '@/hooks/useVehiculos'; // Alias @/
import { crearVehiculo, actualizarVehiculo, eliminarVehiculo, agregarReferenciaVehiculo } from '@/services/vehiculoService'; // Alias @/
import VehiculoModal from '@/components/modals/VehiculoModal'; // Alias @/
import { Vehiculo } from '@/types/Vehiculo'; // Alias @/

const { confirm } = Modal;

const Vehiculos: React.FC = () => {
  const { denominacion } = useParams<{ denominacion: string }>();
  const { vehiculos, loading, municipioId, nombreMunicipio, setVehiculos } = useVehiculos(denominacion || '');
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | undefined>(undefined);

  const showModal = (vehiculo: Vehiculo | undefined = undefined) => {
    setEditingVehiculo(vehiculo);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingVehiculo(undefined);
  };

  const handleSave = async (values: Vehiculo) => {
    try {
      // Convertimos año y kmPorLitro a números para el backend
      const vehiculoData: Vehiculo = {
        ...values,
        año: Number(values.año),
        kmPorLitro: Number(values.kmPorLitro),
      };

      if (editingVehiculo && editingVehiculo.id) {
        await actualizarVehiculo(editingVehiculo.id, vehiculoData);
        setVehiculos(prev => prev.map(v => (v.id === editingVehiculo.id ? { ...vehiculoData, id: editingVehiculo.id } : v)));
        notification.success({ message: 'Vehículo actualizado correctamente.' });
      } else {
        const nuevoVehiculoId = await crearVehiculo(vehiculoData);
        await agregarReferenciaVehiculo(municipioId, nuevoVehiculoId);
        setVehiculos(prev => [...prev, { ...vehiculoData, id: nuevoVehiculoId }]);
        notification.success({ message: 'Vehículo creado correctamente.' });
      }
      handleCancel();
    } catch (error) {
      console.error('Error al guardar vehículo:', error);
      notification.error({ message: 'Error al guardar el vehículo.' });
    }
  };

  const handleDelete = async (id: string) => {
    confirm({
      title: '¿Estás seguro de eliminar este vehículo?',
      icon: <ExclamationCircleOutlined />,
      content: 'Esta acción no se puede deshacer.',
      okText: 'Eliminar',
      okType: 'danger',
      cancelText: 'Cancelar',
      onOk: async () => {
        try {
          await eliminarVehiculo(id);
          setVehiculos(prev => prev.filter(v => v.id !== id));
          notification.success({ message: 'Vehículo eliminado correctamente.' });
        } catch (error) {
          console.error('Error al eliminar vehículo:', error);
          notification.error({ message: 'Error al eliminar el vehículo.' });
        }
      },
    });
  };

  const columns = [
    { title: 'Marca', dataIndex: 'marca', key: 'marca' },
    { title: 'Modelo', dataIndex: 'modelo', key: 'modelo' },
    { title: 'Año', dataIndex: 'año', key: 'año' },
    { title: 'Placa', dataIndex: 'placa', key: 'placa' },
    { title: 'Km por Litro', dataIndex: 'kmPorLitro', key: 'kmPorLitro' },
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_: any, record: Vehiculo) => (
        <Space>
          <Tooltip title="Editar">
            <Button
              icon={<EditOutlined />}
              onClick={() => showModal(record)}
              className="text-blue-600 hover:text-blue-800 border-blue-600 hover:border-blue-800"
            />
          </Tooltip>
          <Tooltip title="Eliminar">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id!)}
              className="text-red-600 hover:text-red-800 border-red-600 hover:border-red-800"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="h-screen px-6 py-8 flex flex-col bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold mb-6 text-center text-blue-800">
        Gestión de Vehículos en {nombreMunicipio || 'Municipio'}
      </h1>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => showModal()}
        className="mb-6 w-full sm:w-auto bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700"
      >
        Agregar Vehículo
      </Button>
      <Table
        dataSource={vehiculos}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: 'No hay vehículos registrados' }}
        className="overflow-x-auto"
      />
      <VehiculoModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSave={handleSave}
        initialValues={editingVehiculo}
      />
    </div>
  );
};

export default Vehiculos;