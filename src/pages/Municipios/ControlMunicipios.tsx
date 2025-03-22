import React, { useState } from 'react';
import { Table, Button, Tooltip, Image } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import useMunicipios from '@/hooks/useMunicipios';
import MunicipioModal from '@/components/modals/MunicipioModal';
import SearchBar from '@/components/SearchBar';
import { Municipio } from '@/types/Municipio';
import {
  crearMunicipio,
  actualizarMunicipio,
  eliminarMunicipio,
  eliminarMunicipioDefinitivamente,
} from '@/services/municipioService';
import { mostrarExito, mostrarError } from '@/utils/notifications';

const ControlMunicipios: React.FC = () => {
  const { filteredMunicipios, loading, error, handleSearch, refetch } = useMunicipios();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [editingMunicipio, setEditingMunicipio] = useState<Municipio | null>(null);

  const handleAddMunicipio = async (values: Partial<Municipio>, imagen?: File, hojaMembretada?: File) => {
    try {
      // Construir un objeto Municipio completo con valores por defecto
      const municipioData: Municipio = {
        vehiculosRef: values.vehiculosRef || [],
        autoridadesRef: values.autoridadesRef || [],
        id: '', // Generar un ID único si es necesario
        denominacion: values.denominacion || '',
        rfc: values.rfc || '',
        tipoVialidad: values.tipoVialidad || '',
        nombreVialidad: values.nombreVialidad || '',
        numeroExterior: values.numeroExterior || '',
        numeroInterior: values.numeroInterior || '',
        nombreColonia: values.nombreColonia || '',
        codigoPostal: values.codigoPostal || '',
        municipio: values.municipio || '',
        entidadFederativa: values.entidadFederativa || '',
        distrito: values.distrito || '',
        nombreLocalidad: values.nombreLocalidad || '',
        entreCalle: values.entreCalle || '',
        otraCalle: values.otraCalle || '',
        fechaCreacion: new Date().toISOString(),
        imagenURL: '', // URL de la imagen (se actualizará después de subir el archivo)
        hojaMembretadaUrl: '', // URL de la hoja membretada (se actualizará después de subir el archivo)
        eliminado: false,
        ...values, // Sobrescribir con los valores proporcionados
      };

      // Llamar a crearMunicipio con el objeto completo y los archivos
      await crearMunicipio(municipioData, imagen, hojaMembretada);
      await refetch();
      mostrarExito('Éxito', 'Municipio creado correctamente.');
      setOpenModal(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      mostrarError('Error al crear municipio', errorMessage);
    }
  };

  const handleEditMunicipio = async (id: string, values: Partial<Municipio>, imagen?: File, hojaMembretada?: File) => {
    try {
      // Actualizar el municipio con los archivos (imagen y hoja membretada)
      await actualizarMunicipio(id, values, imagen, hojaMembretada);
      await refetch(); // Refrescar la lista de municipios
      mostrarExito('Éxito', 'Municipio actualizado correctamente.');
      setOpenModal(false); // Cerrar el modal
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      mostrarError('Error al actualizar municipio', errorMessage);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Eliminar el municipio (mover a la papelera)
      await eliminarMunicipio(id);
      await refetch(); // Refrescar la lista de municipios
      mostrarExito('Éxito', 'Municipio movido a la papelera.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      mostrarError('Error al mover a papelera', errorMessage);
    }
  };

  const handleDeletePermanently = async (id: string) => {
    try {
      // Eliminar el municipio definitivamente
      await eliminarMunicipioDefinitivamente(id);
      await refetch(); // Refrescar la lista de municipios
      mostrarExito('Éxito', 'Municipio eliminado definitivamente.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      mostrarError('Error al eliminar definitivamente', errorMessage);
    }
  };

  const columns = [
    {
      title: 'Imagen',
      dataIndex: 'imagenURL',
      key: 'imagenURL',
      width: 150,
      render: (imagenURL: string) => (
        imagenURL ? (
          <Image
            src={imagenURL}
            alt="Imagen del municipio"
            width={120}
            height={120}
            style={{ objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            preview={{ mask: <div className="flex items-center justify-center text-white">Ver imagen</div> }}
          />
        ) : (
          <div className="flex items-center justify-center bg-gray-200 w-full h-full" style={{ height: '120px', width: '120px' }}>
            Sin imagen
          </div>
        )
      ),
    },
    {
      title: 'Denominación',
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
          <div>Distrito: {record.distrito}</div>
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
          onSubmit={(values, imagen, hojaMembretada) => {
            // Validar que los campos obligatorios estén presentes
            if (!values.denominacion || !values.rfc) {
              mostrarError('Error', 'Denominación y RFC son campos obligatorios.');
              return;
            }

            // Construir un objeto Municipio completo
            const municipioData: Municipio = {
              id: '', // Este campo será asignado por Firestore
              denominacion: values.denominacion,
              rfc: values.rfc,
              tipoVialidad: values.tipoVialidad || '',
              nombreVialidad: values.nombreVialidad || '',
              numeroExterior: values.numeroExterior || '',
              numeroInterior: values.numeroInterior || '',
              nombreColonia: values.nombreColonia || '',
              codigoPostal: values.codigoPostal || '',
              municipio: values.municipio || '',
              entidadFederativa: values.entidadFederativa || '',
              distrito: values.distrito || '',
              nombreLocalidad: values.nombreLocalidad || '',
              entreCalle: values.entreCalle || '',
              otraCalle: values.otraCalle || '',
              fechaCreacion: new Date().toISOString(),
              imagenURL: '',
              hojaMembretadaUrl: '',
              eliminado: false,
              vehiculosRef: values.vehiculosRef || [],
              autoridadesRef: values.autoridadesRef || [],
              ...values, // Sobrescribir con los valores proporcionados
            };

            if (editingMunicipio?.id) {
              handleEditMunicipio(editingMunicipio.id, municipioData, imagen, hojaMembretada);
            } else {
              handleAddMunicipio(municipioData, imagen, hojaMembretada);
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