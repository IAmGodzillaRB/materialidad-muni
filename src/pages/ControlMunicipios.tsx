import React, { useState, useEffect } from 'react';
import { Table, Input, Button, Tooltip, notification } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import MunicipioModal from '../components/modals/MunicipioModal';
import {
    fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
} from '../services/firestoreService'; // Importa el servicio genérico

interface Municipio {
    id: string;
    nombre: string;
    rfc: string;
    direccion: string;
    codigoPostal: string;
}

const ControlMunicipios: React.FC = () => {
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [allMunicipios, setAllMunicipios] = useState<Municipio[]>([]);
    const [filteredMunicipios, setFilteredMunicipios] = useState<Municipio[]>([]);
    const [formData, setFormData] = useState({
        id: '',
        nombre: '',
        rfc: '',
        direccion: '',
        codigoPostal: '',
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [modalLoading, setModalLoading] = useState<boolean>(false);

    // Obtener todos los municipios
    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const municipios = await fetchDocuments('municipios') as Municipio[];
            setAllMunicipios(municipios);
            setFilteredMunicipios(municipios);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setError(errorMessage);
            showNotification('error', 'Error al cargar municipios', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Agregar un nuevo municipio
    const handleAddMunicipio = async (values: any) => {
        try {
            setModalLoading(true);
            await createDocument('municipios', values); // Usa el servicio genérico
            await fetchData();
            showNotification('success', 'Éxito', 'Municipio creado correctamente.');
            setFormData({ id: '', nombre: '', rfc: '', direccion: '', codigoPostal: '' });
            setOpenAddModal(false);
        } catch (error: any) {
            console.error('Error al crear municipio:', error);
            showNotification('error', 'Error al crear municipio', error.message);
        } finally {
            setModalLoading(false);
        }
    };

    // Editar un municipio existente
    const handleEditMunicipio = async (values: any) => {
        try {
            setModalLoading(true);
            await updateDocument('municipios', values.id, values); // Usa el servicio genérico
            await fetchData();
            showNotification('success', 'Éxito', 'Municipio actualizado correctamente.');
            setFormData({ id: '', nombre: '', rfc: '', direccion: '', codigoPostal: '' });
            setOpenEditModal(false);
        } catch (error: any) {
            console.error('Error al actualizar municipio:', error);
            showNotification('error', 'Error al actualizar municipio', error.message);
        } finally {
            setModalLoading(false);
        }
    };

    // Eliminar un municipio
    const handleDelete = async (id: string) => {
        try {
            await deleteDocument('municipios', id); // Usa el servicio genérico
            await fetchData();
            showNotification('success', 'Éxito', 'Municipio eliminado correctamente.');
        } catch (error: any) {
            console.error('Error al eliminar municipio:', error);
            showNotification('error', 'Error al eliminar municipio', error.message);
        }
    };

    // Función para mostrar notificaciones
    const showNotification = (type: 'success' | 'error', message: string, description?: string) => {
        notification[type]({
            message,
            description,
        });
    };

    // Función para buscar municipios
    const handleSearch = (searchTerm: string) => {
        const filtered = allMunicipios.filter(
            (municipio) =>
                municipio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                municipio.rfc.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMunicipios(filtered);
    };

    // Columnas de la tabla
    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'RFC',
            dataIndex: 'rfc',
            key: 'rfc',
        },
        {
            title: 'Dirección',
            dataIndex: 'direccion',
            key: 'direccion',
        },
        {
            title: 'Código Postal',
            dataIndex: 'codigoPostal',
            key: 'codigoPostal',
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (record: Municipio) => (
                <div className="flex space-x-2">
                    <Tooltip title="Editar municipio">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => {
                                setFormData({ ...record });
                                setOpenEditModal(true);
                            }}
                            aria-label="Editar municipio"
                        />
                    </Tooltip>
                    <Tooltip title="Eliminar municipio">
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record.id)}
                            aria-label="Eliminar municipio"
                            danger
                        />
                    </Tooltip>
                </div>
            ),
        },
    ];

    return (
        <div className="flex justify-center h-screen bg-gray-100">
            <div className="w-full px-6 py-8 flex flex-col h-full bg-white shadow-lg rounded-lg">
                <h2 className="text-3xl font-semibold mb-6 text-center text-blue-800">Gestión de Municipios</h2>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                        <p className="font-bold">Error</p>
                        <p>{error}</p>
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-6">
                    <Input
                        placeholder="Buscar por nombre o RFC"
                        className="w-full md:w-1/3"
                        onChange={(e) => handleSearch(e.target.value)}
                        aria-label="Buscar municipios por nombre o RFC"
                    />
                    <div className="flex space-x-2 mt-4 md:mt-0">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setFormData({ id: '', nombre: '', rfc: '', direccion: '', codigoPostal: '' });
                                setOpenAddModal(true);
                            }}
                            aria-label="Agregar nuevo municipio"
                            className="p-2 sm:px-4 sm:py-2 flex items-center justify-center"
                        >
                            <span className="hidden sm:inline">Agregar Municipio</span>
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto flex flex-col h-full">
                    <Table
                        dataSource={filteredMunicipios}
                        columns={columns}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            pageSizeOptions: ['10', '15', '20'],
                        }}
                        bordered
                        scroll={{ x: 'max-content' }}
                        loading={loading}
                        className="w-full"
                    />
                </div>

                <MunicipioModal
                    open={openAddModal}
                    onClose={() => setOpenAddModal(false)}
                    onSubmit={handleAddMunicipio}
                    formData={{ id: '', nombre: '', rfc: '', direccion: '', codigoPostal: '' }}
                    isEditMode={false}
                    loading={modalLoading}
                />

                <MunicipioModal
                    open={openEditModal}
                    onClose={() => setOpenEditModal(false)}
                    onSubmit={handleEditMunicipio}
                    formData={formData}
                    isEditMode={true}
                    loading={modalLoading}
                />
            </div>
        </div>
    );
};

export default ControlMunicipios;