import React, { useState } from 'react';
import { Table, Button, Tooltip, Image } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import useMunicipios from '../../hooks/useMunicipios';
import MunicipioModal from '../../components/modals/MunicipioModal';
import SearchBar from '../../components/SearchBar';
import { Municipio } from '../../types/Municipio';
import {
  crearMunicipio,
  actualizarMunicipio,
  eliminarMunicipio,
  eliminarMunicipioDefinitivamente,
} from '../../services/municipioService';
import { mostrarExito, mostrarError } from '../../utils/notifications';

const ControlMunicipios: React.FC = () => {
  const { filteredMunicipios, loading, error, handleSearch, refetch } = useMunicipios();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editingMunicipio, setEditingMunicipio] = useState<Municipio | null>(null);

  const handleAddMunicipio = async (municipio: Municipio) => {
    const fechaCreacion = {
      ...municipio,
      fechaCreacion: new Date().toISOString()
    };
    
    try {
      await crearMunicipio(fechaCreacion); 
      await refetch();
      mostrarExito('Éxito', 'Municipio creado correctamente.');
      setOpenModal(false); // Cerrar el modal después de agregar
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      mostrarError('Error al crear municipio', errorMessage);
    }
  };
  

  const handleEditMunicipio = async (id: string, municipio: Partial<Municipio>) => {
    try {
      await actualizarMunicipio(id, municipio);
      await refetch();
      mostrarExito('Éxito', 'Municipio actualizado correctamente.');
      setOpenModal(false); // Cerrar el modal después de editar
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      mostrarError('Error al actualizar municipio', errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await eliminarMunicipio(id);
      await refetch();
      mostrarExito('Éxito', 'Municipio movido a la papelera.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      mostrarError('Error al mover a papelera', errorMessage);
    }
  };

  const handleDeletePermanently = async (id: string) => {
    try {
      await eliminarMunicipioDefinitivamente(id);
      await refetch();
      mostrarExito('Éxito', 'Municipio eliminado definitivamente.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      mostrarError('Error al eliminar definitivamente', errorMessage);
    }
  };

  const columns = [
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
      width: 150,
      render: (record: Municipio) => (
        <div className="flex space-x-2">
          <Tooltip title="Editar municipio">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingMunicipio(record);
                setOpenModal(true);
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
          <Tooltip title="Eliminar definitivamente">
            <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleDeletePermanently(record.id)}
              aria-label="Eliminar definitivamente"
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

        <div className="flex justify-end mb-6 gap-2">
          <SearchBar onSearch={handleSearch} />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingMunicipio(null);
              setOpenModal(true);
            }}
            aria-label="Agregar nuevo municipio"
          >
            Agregar Municipio
          </Button>
        </div>

        <div className="overflow-x-auto flex flex-col h-full">
          <Table
            dataSource={filteredMunicipios}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '15', '20'] }}
            bordered
            scroll={{ x: 'max-content' }}
            loading={loading}
          />
        </div>

        <MunicipioModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={(values) => {
            if (editingMunicipio?.id) {
              handleEditMunicipio(editingMunicipio.id, values);
            } else {
              handleAddMunicipio(values);
            }
          }}
          formData={editingMunicipio}
          isEditMode={!!editingMunicipio}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ControlMunicipios;