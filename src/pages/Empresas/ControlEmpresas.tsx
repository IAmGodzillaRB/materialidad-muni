import React, { useState } from 'react';
import { Table, Button, Tooltip, Image } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import useEmpresas from '@/hooks/useEmpresas';
import EmpresaModal from '@/components/modals/EmpresaModal';
import SearchBar from '@/components/SearchBar';
import { Empresa } from '@/types/Empresa';
import {
  crearEmpresa,
  actualizarEmpresa,
  eliminarEmpresa,
  eliminarEmpresaDefinitivamente,
} from '@/services/empresaService';
import { mostrarExito, mostrarError } from '@/utils/notifications';

const ControlEmpresas: React.FC = () => {
  const { filteredEmpresas, loading, error, handleSearch, refetch } = useEmpresas();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);

  const handleAddEmpresa = async (values: Partial<Empresa>, logo?: File, hojaMembretada?: File) => {
    try {
      // Construir un objeto Empresa completo con valores por defecto
      const empresaData: Empresa = {
        id: '', // Generar un ID único si es necesario (puedes usar una librería como `uuid`)
        razonSocial: values.razonSocial || '', // Valor por defecto para propiedades obligatorias
        rfc: values.rfc || '',
        fechaCreacion: new Date().toISOString(), // Fecha de creación actual
        logoUrl: '', // URL del logo (se actualizará después de subir el archivo)
        hojaMembretadaUrl: '', // URL de la hoja membretada (se actualizará después de subir el archivo)
        eliminado: false, // Valor por defecto para propiedades booleanas
        ...values, // Sobrescribir con los valores proporcionados
      };

      // Llamar a crearEmpresa con el objeto completo
      await crearEmpresa(empresaData, logo, hojaMembretada);
      await refetch();
      mostrarExito('Éxito', 'Empresa creada correctamente.');
      setOpenModal(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      mostrarError('Error al crear empresa', errorMessage);
    }
  };

  const handleEditEmpresa = async (id: string, values: Partial<Empresa>, logo?: File, hojaMembretada?: File) => {
    try {
      // Actualizar la empresa con los archivos (logo y hoja membretada)
      await actualizarEmpresa(id, values, logo, hojaMembretada);
      await refetch(); // Refrescar la lista de empresas
      mostrarExito('Éxito', 'Empresa actualizada correctamente.');
      setOpenModal(false); // Cerrar el modal
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      mostrarError('Error al actualizar empresa', errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Eliminar la empresa (mover a la papelera)
      await eliminarEmpresa(id);
      await refetch(); // Refrescar la lista de empresas
      mostrarExito('Éxito', 'Empresa movida a la papelera.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      mostrarError('Error al mover a papelera', errorMessage);
    }
  };

  const handleDeletePermanently = async (id: string) => {
    try {
      // Eliminar la empresa definitivamente
      await eliminarEmpresaDefinitivamente(id);
      await refetch(); // Refrescar la lista de empresas
      mostrarExito('Éxito', 'Empresa eliminada definitivamente.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      mostrarError('Error al eliminar definitivamente', errorMessage);
    }
  };

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logoUrl',
      key: 'logoUrl',
      width: 150,
      render: (logoUrl: string) => (
        logoUrl ? (
          <Image
            src={logoUrl}
            alt="Logo de la empresa"
            width={120}
            height={120}
            style={{ objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            preview={{ mask: <div className="flex items-center justify-center text-white">Ver logo</div> }}
          />
        ) : (
          <div className="flex items-center justify-center bg-gray-200 w-full h-full" style={{ height: '120px', width: '120px' }}>
            Sin logo
          </div>
        )
      ),
    },
    {
      title: 'Razón Social',
      dataIndex: 'razonSocial',
      key: 'razonSocial',
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
      title: 'Hoja Membretada',
      dataIndex: 'hojaMembretadaUrl',
      key: 'hojaMembretadaUrl',
      width: 150,
      render: (url: string) => (
        url ? (
          <a href={url} target="_blank" rel="noopener noreferrer">
            Ver hoja membretada
          </a>
        ) : (
          'Sin hoja membretada'
        )
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
      render: (record: Empresa) => (
        <div className="flex space-x-2">
          <Tooltip title="Editar empresa">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingEmpresa(record);
                setOpenModal(true);
              }}
              aria-label="Editar empresa"
            />
          </Tooltip>
          <Tooltip title="Eliminar empresa">
            <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              aria-label="Eliminar empresa"
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
        <h2 className="text-3xl font-semibold mb-6 text-center text-blue-800">Gestión de Empresas</h2>

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
              setEditingEmpresa(null);
              setOpenModal(true);
            }}
            aria-label="Agregar nueva empresa"
          >
            Agregar Empresa
          </Button>
        </div>

        <div className="overflow-x-auto flex flex-col h-full">
          <Table
            dataSource={filteredEmpresas}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '15', '20'] }}
            bordered
            scroll={{ x: 'max-content' }}
            loading={loading}
          />
        </div>

        <EmpresaModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          onSubmit={(values, logo, hojaMembretada) => {
            // Validar que los campos obligatorios estén presentes
            if (!values.razonSocial || !values.rfc) {
              mostrarError('Error', 'Razón social y RFC son campos obligatorios.');
              return;
            }

            // Construir un objeto Empresa completo
            const empresaData: Empresa = {
              id: '', // Generar un ID único si es necesario
              razonSocial: values.razonSocial,
              rfc: values.rfc,
              fechaCreacion: new Date().toISOString(),
              logoUrl: '',
              hojaMembretadaUrl: '',
              eliminado: false,
              ...values, // Sobrescribir con los valores proporcionados
            };

            if (editingEmpresa?.id) {
              handleEditEmpresa(editingEmpresa.id, empresaData, logo, hojaMembretada);
            } else {
              handleAddEmpresa(empresaData, logo, hojaMembretada);
            }
          }}
          formData={editingEmpresa}
          isEditMode={!!editingEmpresa}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ControlEmpresas;