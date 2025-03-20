import React from 'react';
import { Form, Input, Button, Select, DatePicker, Modal } from 'antd';
import moment from 'moment';
import { Solicitud } from '@/types/Solicitud';

const { Option } = Select;

interface SolicitudModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: Omit<Solicitud, 'id' | 'municipioId' | 'fechaCreacion' | 'eliminado'>) => Promise<void>;
  initialValues: Solicitud | null;
}

const SolicitudModal: React.FC<SolicitudModalProps> = ({
  visible,
  onCancel,
  onSave,
  initialValues,
}) => {
  const [form] = Form.useForm();

  // Inicializar el formulario cuando se abre o cambian los valores iniciales
  React.useEffect(() => {
    if (visible) {
      if (initialValues) {
        const formattedValues = {
          ...initialValues,
          fecha: initialValues.fecha ? moment(initialValues.fecha) : null,
        };
        form.setFieldsValue(formattedValues);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialValues, form]);

  // Manejar el envío del formulario
  const handleSubmit = async (values: any) => {
    try {
      const formattedValues: Omit<Solicitud, 'id' | 'municipioId' | 'fechaCreacion' | 'eliminado'> = {
        ...values,
        fecha: values.fecha ? values.fecha.toISOString() : new Date().toISOString(),
      };
      await onSave(formattedValues);
      form.resetFields();
    } catch (error) {
      console.error('Error al guardar la solicitud:', error);
    }
  };

  return (
    <Modal
      title={initialValues ? 'Editar Solicitud' : 'Agregar Solicitud'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      destroyOnClose={true}
    >
      <div className="p-4">
        {visible && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            preserve={false}
          >
            <Form.Item
              label="Descripción"
              name="descripcion"
              rules={[{ required: true, message: 'Este campo es obligatorio' }]}
            >
              <Input placeholder="Describe la solicitud" />
            </Form.Item>

            <Form.Item
              label="Estado"
              name="estado"
              rules={[{ required: true, message: 'Este campo es obligatorio' }]}
              initialValue="Pendiente"
            >
              <Select placeholder="Selecciona el estado">
                <Option value="Pendiente">Pendiente</Option>
                <Option value="En Proceso">En Proceso</Option>
                <Option value="Completada">Completada</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Solicitante"
              name="solicitante"
              rules={[{ required: true, message: 'Este campo es obligatorio' }]}
            >
              <Input placeholder="Nombre del solicitante" />
            </Form.Item>

            <Form.Item
              label="Fecha"
              name="fecha"
              rules={[{ required: true, message: 'Este campo es obligatorio' }]}
            >
              <DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                {initialValues ? 'Actualizar Solicitud' : 'Crear Solicitud'}
              </Button>
              <Button onClick={onCancel} style={{ marginLeft: 8 }}>
                Cancelar
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </Modal>
  );
};

export default SolicitudModal;