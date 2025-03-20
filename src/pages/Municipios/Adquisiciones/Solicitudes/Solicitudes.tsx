import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Tooltip, notification, Space, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import useSolicitudes from '@/hooks/useSolicitudes';
import { crearSolicitud, actualizarSolicitud, eliminarSolicitud } from '@/services/solicitudService';
import SolicitudModal from '@/components/modals/SolicitudModal';
import { Solicitud } from '@/types/Solicitud';

const Solicitudes: React.FC = () => {
    const { denominacion } = useParams<{ denominacion: string }>();
    const { solicitudes, loading, nombreMunicipio, municipioRef, setSolicitudes } = useSolicitudes(denominacion || '');
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [editingSolicitud, setEditingSolicitud] = useState<Solicitud | null>(null);

    const showModal = (solicitud: Solicitud | null = null) => {
        setEditingSolicitud(solicitud);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingSolicitud(null);
    };

    const handleSave = async (values: Omit<Solicitud, 'id' | 'municipioId' | 'fechaCreacion' | 'eliminado'>) => {
        try {
            if (!municipioRef) throw new Error('Referencia de municipio no encontrada');

            const solicitudData: Solicitud = {
                ...values,
                municipioId: municipioRef,
                fechaCreacion: new Date().toISOString(),
                eliminado: false
            };

            if (editingSolicitud && editingSolicitud.id) {
                await actualizarSolicitud(editingSolicitud.id, solicitudData);
                setSolicitudes(prev =>
                    prev.map(s => (s.id === editingSolicitud.id ? { ...solicitudData, id: editingSolicitud.id } : s))
                );
                notification.success({ message: 'Solicitud actualizada correctamente.' });
            } else {
                const nuevaSolicitudId = await crearSolicitud(solicitudData);
                setSolicitudes(prev => [...prev, { ...solicitudData, id: nuevaSolicitudId }]);
                notification.success({ message: 'Solicitud creada correctamente.' });
            }
            handleCancel();
        } catch (error) {
            console.error('Error al guardar solicitud:', error);
            notification.error({ message: 'Error al guardar la solicitud.' });
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await eliminarSolicitud(id);
            setSolicitudes(prev => prev.filter(s => s.id !== id));
            notification.success({ message: 'Solicitud eliminada correctamente.' });
        } catch (error) {
            console.error('Error al eliminar solicitud:', error);
            notification.error({ message: 'Error al eliminar la solicitud.' });
        }
    };

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="w-full px-6 py-8 flex flex-col h-full bg-white shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-4">Gestión de Solicitudes en {nombreMunicipio}</h1>
                <Spin spinning={loading} tip="Cargando solicitudes..." size="large">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal()}
                        style={{ marginBottom: 16 }}
                    >
                        Agregar Solicitud
                    </Button>

                    <Table
                        dataSource={solicitudes}
                        rowKey="id"
                        loading={loading}
                        pagination={{ pageSize: 5 }}
                        locale={{ emptyText: 'No hay solicitudes registradas' }}
                    >
                        <Table.Column title="Descripción" dataIndex="descripcion" key="descripcion" />
                        <Table.Column title="Estado" dataIndex="estado" key="estado" />
                        <Table.Column title="Solicitante" dataIndex="solicitante" key="solicitante" />
                        <Table.Column title="Fecha" dataIndex="fecha" key="fecha" />
                        <Table.Column
                            title="Acciones"
                            key="acciones"
                            render={(_, record: Solicitud) => (
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

                <SolicitudModal
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    onSave={handleSave}
                    initialValues={editingSolicitud}
                />
            </div>
        </div>
    );
};

export default Solicitudes;