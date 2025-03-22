import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Button, Tooltip, notification, Space, Spin } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, FileTextOutlined } from '@ant-design/icons';
import useSolicitudes from '@/hooks/useSolicitudes';
import { crearSolicitud, actualizarSolicitud, eliminarSolicitud } from '@/services/solicitudService';

import SolicitudModal from '@/components/modals/SolicitudModal';
import { Solicitud } from '@/types/Solicitud';
import { obtenerMunicipioPorId } from '@/services/municipioService'; // Importa la función para obtener el municipio
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3000';

const Solicitudes: React.FC = () => {
    const { denominacion } = useParams<{ denominacion: string }>();
    const { solicitudes, loading, nombreMunicipio, municipioRef, setSolicitudes } = useSolicitudes(denominacion || '');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingSolicitud, setEditingSolicitud] = useState<Solicitud | null>(null);



    const showModal = (solicitud: Solicitud | null = null) => {
        setEditingSolicitud(solicitud);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditingSolicitud(null);
    };

    const handleSave = async (values: Omit<Solicitud, 'id' | 'municipioId' | 'fechaCreacion' | 'eliminado'>) => {
        try {
            if (!municipioRef) throw new Error('Referencia de municipio no encontrada');
            const solicitudData: Solicitud = {
                ...values,
                municipioId: municipioRef,
                fechaCreacion: new Date().toISOString(),
                eliminado: false,
            };
            if (editingSolicitud && editingSolicitud.id) {
                await actualizarSolicitud(editingSolicitud.id, solicitudData);
                setSolicitudes((prev) =>
                    prev.map((s) => (s.id === editingSolicitud.id ? { ...solicitudData, id: editingSolicitud.id } : s))
                );
                notification.success({ message: 'Solicitud actualizada correctamente.' });
            } else {
                const nuevaSolicitudId = await crearSolicitud(solicitudData);
                setSolicitudes((prev) => [...prev, { ...solicitudData, id: nuevaSolicitudId }]);
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
            setSolicitudes((prev) => prev.filter((s) => s.id !== id));
            notification.success({ message: 'Solicitud eliminada correctamente.' });
        } catch (error) {
            console.error('Error al eliminar solicitud:', error);
            notification.error({ message: 'Error al eliminar la solicitud.' });
        }
    };

    const showLetterheadModal = async (solicitud: Solicitud) => {
        try {
            // Obtener la hoja membretada del municipio
            if (!municipioRef) throw new Error('Referencia de municipio no encontrada');
            const municipio = await obtenerMunicipioPorId(municipioRef.id); // Usa la función para obtener el municipio
            const hojaMembretadaUrl = municipio?.hojaMembretadaUrl;

            if (!hojaMembretadaUrl) {
                throw new Error('No se encontró la hoja membretada del municipio');
            }

            // Generar el documento Word
            const url = `${BACKEND_URL}/generate-docx?url=${encodeURIComponent(
                hojaMembretadaUrl // URL de la hoja membretada del municipio
            )}&descripcion=${encodeURIComponent(
                solicitud.descripcion || 'N/A'
            )}&estado=${encodeURIComponent(
                solicitud.estado || 'N/A'
            )}&solicitante=${encodeURIComponent(
                solicitud.solicitante || 'N/A'
            )}&fecha=${encodeURIComponent(solicitud.fecha || 'N/A')}`;

            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al generar el documento: ${errorText}`);
            }

            const blob = await response.blob();
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `Solicitud_${solicitud.id}.docx`;
            link.click();
            URL.revokeObjectURL(downloadUrl);

            notification.success({
                message: 'Documento Word generado',
                description: 'Los datos se han insertado en la hoja membretada y se ha descargado correctamente.',
            });
        } catch (error) {
            console.error('Error al generar el Word:', error);
            notification.error({
                message: 'Error al generar el Word',
                description: `No se pudo insertar los datos en la hoja membretada: ${(error as Error).message}`,
            });
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
                                    <Tooltip title="Insertar en Hoja Membretada">
                                        <Button
                                            icon={<FileTextOutlined />}
                                            onClick={() => showLetterheadModal(record)}
                                        />
                                    </Tooltip>
                                </Space>
                            )}
                        />
                    </Table>
                </Spin>

                <SolicitudModal
                    visible={isModalOpen}
                    onCancel={handleCancel}
                    onSave={handleSave}
                    initialValues={editingSolicitud}
                />
            </div>
        </div>
    );
};

export default Solicitudes;