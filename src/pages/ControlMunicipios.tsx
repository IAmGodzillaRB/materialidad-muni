import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Input, Button, Tooltip, notification, Image, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import MunicipioModal from '../components/modals/MunicipioModal';
import { fetchDocuments, createDocument, updateDocument } from '../services/firestoreService';

interface Municipio {
    id: string;
    rfc: string;
    denominacion: string;
    codigoPostal: string;
    nombreVialidad: string;
    numeroInterior?: string;
    nombreLocalidad: string;
    entidadFederativa: string;
    tipoVialidad?: string;
    numeroExterior: string;
    nombreColonia?: string;
    municipio: string;
    entreCalle?: string;
    otraCalle?: string;
    imagen?: string;
    fechaCreacion: string;
    eliminado?: boolean; 
}

const initialFormData: Municipio = {
    id: '',
    rfc: '', 
    denominacion: '',
    codigoPostal: '',
    nombreVialidad: '',
    nombreLocalidad: '',
    entidadFederativa: '',
    numeroExterior: '',
    municipio: '',
    fechaCreacion: '',
};

const ControlMunicipios: React.FC = () => {
    const [openAddModal, setOpenAddModal] = useState<boolean>(false);
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);
    const [allMunicipios, setAllMunicipios] = useState<Municipio[]>([]);
    const [filteredMunicipios, setFilteredMunicipios] = useState<Municipio[]>([]);
    const [formData, setFormData] = useState<Municipio>(initialFormData);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [modalLoading, setModalLoading] = useState<boolean>(false);

    // Función para limpiar campos undefined o vacíos
    const cleanDocumentData = useCallback((data: Partial<Municipio>): Partial<Municipio> => {
        return Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined && value !== '')
        );
    }, []);

    // Obtener todos los municipios
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const municipios = await fetchDocuments('municipios', '') as Municipio[];
            // Filtrar solo los municipios no eliminados
            const municipiosActivos = municipios.filter(municipio => !municipio.eliminado);
            setAllMunicipios(municipiosActivos);
            setFilteredMunicipios(municipiosActivos);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            setError(errorMessage);
            showNotification('error', 'Error al cargar municipios', errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Agregar un nuevo municipio
    const handleAddMunicipio = useCallback(async (values: Municipio) => {
        try {
            setModalLoading(true);

            // Asignar fecha de creación automáticamente
            values.fechaCreacion = new Date().toISOString();

            // Limpiar datos antes de enviar a Firestore
            const cleanedData = cleanDocumentData(values);

            await createDocument('municipios', cleanedData);
            await fetchData();
            showNotification('success', 'Éxito', 'Municipio creado correctamente.');
            setOpenAddModal(false);
        } catch (error: any) {
            console.error('Error al crear municipio:', error);
            showNotification('error', 'Error al crear municipio', error.message);
        } finally {
            setModalLoading(false);
        }
    }, [cleanDocumentData, fetchData]);

    // Editar un municipio existente
    const handleEditMunicipio = useCallback(async (values: Municipio) => {
        try {
            setModalLoading(true);

            // Verificar que el ID esté presente
            if (!values.id) {
                throw new Error("El ID del municipio no está definido.");
            }

            // Limpiar datos antes de enviar a Firestore
            const cleanedData = cleanDocumentData(values);

            // Actualizar el documento en Firestore
            await updateDocument('municipios', values.id, cleanedData);

            // Actualizar la tabla
            await fetchData();

            // Mostrar notificación de éxito
            showNotification('success', 'Éxito', 'Municipio actualizado correctamente.');

            // Cerrar el modal de edición
            setOpenEditModal(false);
        } catch (error: any) {
            console.error('Error al actualizar municipio:', error);
            showNotification('error', 'Error al actualizar municipio', error.message);
        } finally {
            setModalLoading(false);
        }
    }, [cleanDocumentData, fetchData]);

    // Eliminar un municipio (mover a papelera)
    const handleDelete = useCallback(async (id: string) => {
        Modal.confirm({
            title: '¿Estás seguro de eliminar este municipio?',
            content: 'El municipio se moverá a la papelera y no se eliminará permanentemente.',
            okText: 'Sí, mover a papelera',
            cancelText: 'Cancelar',
            onOk: async () => {
                try {
                    // Marcar el municipio como eliminado
                    await updateDocument('municipios', id, { eliminado: true });
                    await fetchData();
                    showNotification('success', 'Éxito', 'Municipio movido a la papelera.');
                } catch (error: any) {
                    console.error('Error al mover a papelera:', error);
                    showNotification('error', 'Error al mover a papelera', error.message);
                }
            },
        });
    }, [fetchData]);

    // Función para mostrar notificaciones
    const showNotification = useCallback((type: 'success' | 'error', message: string, description?: string) => {
        notification[type]({
            message,
            description,
        });
    }, []);

    // Función para buscar municipios
    const handleSearch = useCallback((searchTerm: string) => {
        const filtered = allMunicipios.filter(
            (municipio) =>
                municipio.denominacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                municipio.rfc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                municipio.municipio.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredMunicipios(filtered);
    }, [allMunicipios]);

    // Columnas de la tabla (memorizadas)
    const columns = useMemo(() => [
        {
            title: 'Imagen',
            dataIndex: 'imagen',
            key: 'imagen',
            width: 150,
            render: (imagen: string) => (
                <Image
                    src={imagen}
                    alt="Imagen del municipio"
                    width={120}
                    height={120}
                    style={{ objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    preview={{ mask: <div className="flex items-center justify-center text-white">Ver imagen</div> }}
                    placeholder={
                        <div className="flex items-center justify-center bg-gray-200 w-full h-full" style={{ height: '120px', width: '120px' }}>
                            Sin imagen
                        </div>
                    }
                />
            ),
        },
        {
            title: 'Denominación Social',
            dataIndex: 'denominacion',
            key: 'denominacion',
            width: 200,
            render: (text: string) => <strong>{text}</strong>,
        },
        {
            title: 'RFC',
            dataIndex: 'rfc',
            key: 'rfc',
            width: 150,
            render: (text: string) => <strong>{text}</strong>,
        },
        {
            title: 'Dirección',
            key: 'direccion',
            render: (_text: string, record: Municipio) => (
                <div>
                    <div>{record.tipoVialidad} {record.nombreVialidad} #{record.numeroExterior} 
                        {record.numeroInterior && ` Int. ${record.numeroInterior}`}
                    </div>
                    <div className="text-gray-500 text-sm">
                        Col. {record.nombreColonia || 'N/A'}, CP {record.codigoPostal}
                    </div>
                    <div className="text-gray-500 text-sm">
                        {record.municipio}, {record.entidadFederativa}
                    </div>
                </div>
            ),
        },
        {
            title: 'Información Adicional',
            key: 'informacionAdicional',
            render: (_text: string, record: Municipio) => (
                <div>
                    <div>Localidad: {record.nombreLocalidad}</div>
                    {record.entreCalle && <div>Entre calles: {record.entreCalle} y {record.otraCalle}</div>}
                </div>
            ),
        },
        {
            title: 'Fecha de Creación',
            dataIndex: 'fechaCreacion',
            key: 'fechaCreacion',
            width: 150,
            render: (date: string) => {
                const formattedDate = new Date(date).toLocaleDateString('es-MX', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                });
                return <div>{formattedDate}</div>;
            },
        },
        {
            title: 'Acciones',
            key: 'actions',
            width: 100,
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
    ], [handleDelete]);

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
                        placeholder="Buscar por denominación, RFC o municipio"
                        className="w-full md:w-1/3"
                        onChange={(e) => handleSearch(e.target.value)}
                        aria-label="Buscar municipios"
                    />
                    <div className="flex space-x-2 mt-4 md:mt-0">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => {
                                setFormData(initialFormData);
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
                    formData={initialFormData}
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