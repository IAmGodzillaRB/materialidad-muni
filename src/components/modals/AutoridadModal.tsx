import React from 'react';
import { Modal, Form, Input } from 'antd';
import { Autoridad } from '../../types/Autoridad';

interface AutoridadModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: Autoridad) => void;
  initialValues?: Autoridad | null;
}

const AutoridadModal: React.FC<AutoridadModalProps> = ({ visible, onCancel, onSave, initialValues }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue(initialValues || { nombre: '', puesto: '', telefono: '' });
  }, [initialValues, form]);

  return (
    <Modal
      title={initialValues ? 'Editar Autoridad' : 'Agregar Autoridad'}  
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
    >
      <Form form={form} layout="vertical" onFinish={onSave}>
        <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Campo requerido' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="puesto" label="Puesto" rules={[{ required: true, message: 'Campo requerido' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AutoridadModal;