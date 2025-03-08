import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Table, Input, Button, Tooltip, notification, Modal, Form, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { 
  fetchDocuments, 
  createDocument, 
  updateDocument, 
  deleteDocument, 
  getDocumentById,
  createDocRef 
} from '../../services/firestoreService';
import { normalizaDenominacion } from '../../utils/normalizaDenominacion';
import { DocumentReference } from 'firebase/firestore';

interface Municipio {
  id: string;
  denominacion: string;
  autoridadesRef?: DocumentReference[] | string[];
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
  const [debug, setDebug] = useState<string>('');

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
          console.log('Municipio encontrado:', municipioSeleccionado);

          if (municipioSeleccionado.autoridadesRef && municipioSeleccionado.autoridadesRef.length > 0) {
            console.log('Referencias de autoridades:', municipioSeleccionado.autoridadesRef);
            setDebug(`Encontradas ${municipioSeleccionado.autoridadesRef.length} referencias`);
            
            // Lista para almacenar las autoridades
            const listaAutoridades: Autoridad[] = [];
            
            // Procesar cada referencia
            for (const ref of municipioSeleccionado.autoridadesRef) {
              try {
                let autoridadId: string;
                
                // Extraer el ID dependiendo del tipo de referencia
                if (typeof ref === 'string') {
                  autoridadId = ref;
                } else {
                  // Obtener el ID si es un DocumentReference
                  autoridadId = (ref as any).id;
                }
                
                console.log(`Procesando autoridad con ID: ${autoridadId}`);
                
                // Obtener el documento de autoridad
                const autoridadDoc = await getDocumentById<Autoridad>('autoridades', autoridadId);
                
                if (autoridadDoc) {
                  listaAutoridades.push({
                    ...autoridadDoc,
                    id: autoridadId
                  });
                  console.log(`Autoridad encontrada:`, autoridadDoc);
                } else {
                  console.warn(`No se encontró la autoridad con ID: ${autoridadId}`);
                }
              } catch (error) {
                console.error('Error al procesar autoridad:', error);
              }
            }
            
            setAutoridades(listaAutoridades);
            console.log('Autoridades cargadas:', listaAutoridades);
          } else {
            setAutoridades([]);
            console.log('No hay referencias de autoridades');
          }
        } else {
          notification.warning({ message: 'Advertencia', description: 'El municipio no existe.' });
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
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
        // Actualizar autoridad existente
        await updateDocument('autoridades', editingAutoridad.id, values);
        notification.success({ message: 'Éxito', description: 'Autoridad actualizada correctamente.' });
        
        // Actualizar estado local
        setAutoridades(prevAutoridades => 
          prevAutoridades.map(auth => 
            auth.id === editingAutoridad.id ? { ...values, id: editingAutoridad.id } : auth
          )
        );
      } else {
        // Crear nueva autoridad
        const nuevaAutoridadId = await createDocument('autoridades', values);
        console.log('Nueva autoridad creada con ID:', nuevaAutoridadId);
        
        // Obtener el municipio actual
        const municipio = await getDocumentById<Municipio>('municipios', municipioId);
        
        if (!municipio) {
          throw new Error('No se pudo encontrar el municipio');
        }
        
        // Crear una referencia al documento de autoridad (como DocumentReference)
        const autoridadRef = createDocRef('autoridades', nuevaAutoridadId);
        console.log('Creada referencia a autoridad:', autoridadRef);
        
        // Añadir la referencia al municipio (guardando como referencia, no como string)
        const nuevasReferencias = [...(municipio.autoridadesRef || []), autoridadRef];
        await updateDocument('municipios', municipioId, { autoridadesRef: nuevasReferencias });
        console.log('Municipio actualizado con nueva referencia');
        
        // Añadir a estado local
        setAutoridades(prevAutoridades => [
          ...prevAutoridades, 
          { ...values, id: nuevaAutoridadId }
        ]);
        
        notification.success({ message: 'Éxito', description: 'Autoridad creada correctamente.' });
      }
      
      handleCancel();
    } catch (error) {
      console.error('Error al guardar autoridad:', error);
      notification.error({ message: 'Error', description: 'Hubo un problema al guardar la autoridad.' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Eliminar el documento de autoridad
      await deleteDocument('autoridades', id);
      console.log(`Autoridad con ID ${id} eliminada`);
      
      // Obtener el municipio para actualizar sus referencias
      const municipio = await getDocumentById<Municipio>('municipios', municipioId);
      
      if (!municipio) {
        throw new Error('No se pudo encontrar el municipio');
      }
      
      // Filtrar las referencias para eliminar la referencia a la autoridad eliminada
      const nuevasReferencias = municipio.autoridadesRef?.filter(ref => {
        if (typeof ref === 'string') {
          return ref !== id;
        } else {
          // Comparar el ID si es una referencia
          return (ref as any).id !== id;
        }
      }) || [];
      
      // Actualizar el municipio
      await updateDocument('municipios', municipioId, { autoridadesRef: nuevasReferencias });
      console.log('Referencias actualizadas en el municipio');
      
      // Actualizar estado local
      setAutoridades(prevAutoridades => prevAutoridades.filter(auth => auth.id !== id));
      
      notification.success({ message: 'Éxito', description: 'Autoridad eliminada correctamente.' });
    } catch (error) {
      console.error('Error al eliminar autoridad:', error);
      notification.error({ message: 'Error', description: 'Hubo un problema al eliminar la autoridad.' });
    }
  };

  return (
    <div>
      <h2>Gestión de Autoridades en {nombreMunicipio}</h2>
      
      {/* Panel de depuración (eliminar en producción) */}
      {process.env.NODE_ENV !== 'production' && (
        <div style={{ marginBottom: 16, padding: 10, background: '#f9f9f9', border: '1px solid #ddd' }}>
          <h4>Debug</h4>
          <p>Municipio ID: {municipioId}</p>
          <p>Autoridades cargadas: {autoridades.length}</p>
          <p>{debug}</p>
        </div>
      )}
      
      <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} style={{ marginBottom: 16 }}>
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
      
      <Modal title={editingAutoridad ? 'Editar Autoridad' : 'Agregar Autoridad'} open={isModalVisible} onCancel={handleCancel} onOk={() => form.submit()}>
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