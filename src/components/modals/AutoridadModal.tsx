import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';

interface Autoridad {
  id?: string;
  nombre: string;
  puesto: string;
  telefono: string;
}

interface AutoridadModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: Autoridad) => Promise<void>;
  formData: Autoridad | null;
  isEditMode: boolean;
  loading: boolean;
}

const AutoridadModal: React.FC<AutoridadModalProps> = ({
  visible,
  onClose,
  onSubmit,
  formData,
  isEditMode,
  loading,
}) => {
  const [form] = Form.useForm();

  // Actualizar el formulario cuando el modal se abre o cambian los datos
  useEffect(() => {
    if (visible && formData) {
      form.setFieldsValue(formData); // Actualizar el formulario con los datos de formData
    } else {
      form.resetFields(); // Limpiar el formulario si no hay datos
    }
  }, [visible, formData, form]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (values: Autoridad) => {
    await onSubmit(values);
    form.resetFields(); // Limpiar el formulario después de enviar
  };

  // Función para manejar la cancelación
  const handleCancel = () => {
    form.resetFields(); // Limpiar el formulario
    onClose(); // Cerrar el modal
  };

  return (
    <Modal
      title={isEditMode ? 'Editar Autoridad' : 'Agregar Autoridad'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose // Destruir el modal al cerrar para reiniciar el estado
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        preserve={false} // No preservar los valores del formulario al cerrar
      >
        {/* Campo para el nombre */}
        <Form.Item
          label="Nombre"
          name="nombre"
          rules={[{ required: true, message: 'Por favor ingresa el nombre' }]}
        >
          <Input placeholder="Nombre de la autoridad" />
        </Form.Item>

        {/* Campo para el puesto */}
        <Form.Item
          label="Puesto"
          name="puesto"
          rules={[{ required: true, message: 'Por favor ingresa el puesto' }]}
        >
          <Input placeholder="Puesto de la autoridad" />
        </Form.Item>

        {/* Campo para el teléfono */}
        <Form.Item
          label="Teléfono"
          name="telefono"
          rules={[{ required: true, message: 'Por favor ingresa el teléfono' }]}
        >
          <Input placeholder="Teléfono de la autoridad" />
        </Form.Item>

        {/* Botones de acción */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEditMode ? 'Actualizar' : 'Guardar'}
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={handleCancel} disabled={loading}>
            Cancelar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AutoridadModal;