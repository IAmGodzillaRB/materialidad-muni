import React from 'react';
import { Form, Input, Modal } from 'antd';
import { Municipio } from '../../types/Municipio';

interface MunicipioModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Municipio) => void;
  formData?: Municipio | null;
  isEditMode?: boolean;
  loading?: boolean;
}

const MunicipioModal: React.FC<MunicipioModalProps> = ({ open, onClose, onSubmit, formData, isEditMode, loading }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    form.setFieldsValue(formData || {});
  }, [formData, form]);

  return (
    <Modal
      title={isEditMode ? 'Editar Municipio' : 'Agregar Municipio'}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="denominacion" label="Denominación" rules={[{ required: true, message: 'Campo requerido' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="rfc" label="RFC" rules={[{ required: true, message: 'Campo requerido' }]}>
          <Input />
        </Form.Item>
        {/* Agrega más campos según sea necesario */}
      </Form>
    </Modal>
  );
};

export default MunicipioModal;