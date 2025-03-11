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
  vehiculosRef?: DocumentReference[] | string[];
}

interface Vehiculo {
  id?: string;
  marca: string;
  modelo: string;
  año: number;
  placa: string;
}

const initialFormData: Vehiculo = {
  marca: '',
  modelo: '',
  año: 0,
  placa: '',
};

const Vehiculos: React.FC = () => {
  const { denominacion } = useParams<{ denominacion: string }>();
  const [nombreMunicipio, setNombreMunicipio] = useState<string>('');
  const [municipioId, setMunicipioId] = useState<string>('');
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editingVehiculo, setEditingVehiculo] = useState<Vehiculo | null>(null);
  const [debug, setDebug] = useState<string>('');

  useEffect(() => {
    if (!denominacion) {
      notification.error({ message: 'Error', description: 'No se pudo obtener la denominación del municipio.' });
      return;
    }

    const fetchMunicipioYVehiculos = async () => {
      try {
        const fetchedMunicipios = await fetchDocuments<Municipio>('municipios', '');
        const municipioSeleccionado = fetchedMunicipios.find(
          (m) => normalizaDenominacion(m.denominacion) === normalizaDenominacion(decodeURIComponent(denominacion))
        );

        if (municipioSeleccionado) {
          setNombreMunicipio(municipioSeleccionado.denominacion);
          setMunicipioId(municipioSeleccionado.id);
          console.log('Municipio encontrado:', municipioSeleccionado);

          if (municipioSeleccionado.vehiculosRef && municipioSeleccionado.vehiculosRef.length > 0) {
            console.log('Referencias de vehículos:', municipioSeleccionado.vehiculosRef);
            setDebug(`Encontradas ${municipioSeleccionado.vehiculosRef.length} referencias`);
            
            const listaVehiculos: Vehiculo[] = [];
            
            for (const ref of municipioSeleccionado.vehiculosRef) {
              try {
                let vehiculoId: string;
                
                if (typeof ref === 'string') {
                  vehiculoId = ref;
                } else {
                  vehiculoId = (ref as any).id;
                }
                
                console.log(`Procesando vehículo con ID: ${vehiculoId}`);
                
                const vehiculoDoc = await getDocumentById<Vehiculo>('vehiculos', vehiculoId);
                
                if (vehiculoDoc) {
                  listaVehiculos.push({
                    ...vehiculoDoc,
                    id: vehiculoId
                  });
                  console.log(`Vehículo encontrado:`, vehiculoDoc);
                } else {
                  console.warn(`No se encontró el vehículo con ID: ${vehiculoId}`);
                }
              } catch (error) {
                console.error('Error al procesar vehículo:', error);
              }
            }
            
            setVehiculos(listaVehiculos);
            console.log('Vehículos cargados:', listaVehiculos);
          } else {
            setVehiculos([]);
            console.log('No hay referencias de vehículos');
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

    fetchMunicipioYVehiculos();
  }, [denominacion]);

  const showModal = (vehiculo: Vehiculo | null = null) => {
    setEditingVehiculo(vehiculo);
    form.setFieldsValue(vehiculo || initialFormData);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingVehiculo(null);
    form.resetFields();
  };

  const handleSave = async (values: Vehiculo) => {
    try {
      if (!municipioId) throw new Error('Municipio ID es undefined');

      if (editingVehiculo && editingVehiculo.id) {
        await updateDocument('vehiculos', editingVehiculo.id, values);
        notification.success({ message: 'Éxito', description: 'Vehículo actualizado correctamente.' });
        
        setVehiculos(prevVehiculos => 
          prevVehiculos.map(veh => 
            veh.id === editingVehiculo.id ? { ...values, id: editingVehiculo.id } : veh
          )
        );
      } else {
        const nuevoVehiculoId = await createDocument('vehiculos', values);
        console.log('Nuevo vehículo creado con ID:', nuevoVehiculoId);
        
        const municipio = await getDocumentById<Municipio>('municipios', municipioId);
        
        if (!municipio) {
          throw new Error('No se pudo encontrar el municipio');
        }
        
        const vehiculoRef = createDocRef('vehiculos', nuevoVehiculoId);
        console.log('Creada referencia a vehículo:', vehiculoRef);
        
        const nuevasReferencias = [...(municipio.vehiculosRef || []), vehiculoRef];
        await updateDocument('municipios', municipioId, { vehiculosRef: nuevasReferencias });
        console.log('Municipio actualizado con nueva referencia');
        
        setVehiculos(prevVehiculos => [
          ...prevVehiculos, 
          { ...values, id: nuevoVehiculoId }
        ]);
        
        notification.success({ message: 'Éxito', description: 'Vehículo creado correctamente.' });
      }
      
      handleCancel();
    } catch (error) {
      console.error('Error al guardar vehículo:', error);
      notification.error({ message: 'Error', description: 'Hubo un problema al guardar el vehículo.' });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocument('vehiculos', id);
      console.log(`Vehículo con ID ${id} eliminado`);
      
      const municipio = await getDocumentById<Municipio>('municipios', municipioId);
      
      if (!municipio) {
        throw new Error('No se pudo encontrar el municipio');
      }
      
      const nuevasReferencias = municipio.vehiculosRef?.filter(ref => {
        if (typeof ref === 'string') {
          return ref !== id;
        } else {
          return (ref as any).id !== id;
        }
      }) || [];
      
      await updateDocument('municipios', municipioId, { vehiculosRef: nuevasReferencias });
      console.log('Referencias actualizadas en el municipio');
      
      setVehiculos(prevVehiculos => prevVehiculos.filter(veh => veh.id !== id));
      
      notification.success({ message: 'Éxito', description: 'Vehículo eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar vehículo:', error);
      notification.error({ message: 'Error', description: 'Hubo un problema al eliminar el vehículo.' });
    }
  };

  return (
    <div>
      <h2>Gestión de Vehículos en {nombreMunicipio}</h2>
      
      {process.env.NODE_ENV !== 'production' && (
        <div style={{ marginBottom: 16, padding: 10, background: '#f9f9f9', border: '1px solid #ddd' }}>
          <h4>Debug</h4>
          <p>Municipio ID: {municipioId}</p>
          <p>Vehículos cargados: {vehiculos.length}</p>
          <p>{debug}</p>
        </div>
      )}
      
      <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()} style={{ marginBottom: 16 }}>
        Agregar Vehículo
      </Button>
      
      <Table 
        dataSource={vehiculos} 
        rowKey="id" 
        loading={loading} 
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: 'No hay vehículos registrados' }}
      >
        <Table.Column title="Marca" dataIndex="marca" key="marca" />
        <Table.Column title="Modelo" dataIndex="modelo" key="modelo" />
        <Table.Column title="Año" dataIndex="año" key="año" />
        <Table.Column title="Placa" dataIndex="placa" key="placa" />
        <Table.Column
          title="Acciones"
          key="acciones"
          render={(_, record: Vehiculo) => (
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
      
      <Modal title={editingVehiculo ? 'Editar Vehículo' : 'Agregar Vehículo'} open={isModalVisible} onCancel={handleCancel} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item name="marca" label="Marca" rules={[{ required: true, message: 'Campo requerido' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="modelo" label="Modelo" rules={[{ required: true, message: 'Campo requerido' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="año" label="Año" rules={[{ required: true, message: 'Campo requerido' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="placa" label="Placa" rules={[{ required: true, message: 'Campo requerido' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Vehiculos;