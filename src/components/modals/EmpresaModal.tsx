import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Spin, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Empresa } from '../../types/Empresa';
import { UploadFile } from 'antd/lib/upload/interface';

interface EmpresaModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<Empresa>, logo?: File, hojaMembretada?: File) => void;
  formData: Empresa | null;
  isEditMode: boolean;
  loading: boolean;
}

const EmpresaModal: React.FC<EmpresaModalProps> = ({ open, onClose, onSubmit, formData, isEditMode, loading }) => {
  const [form] = Form.useForm();
  const [logoFile, setLogoFile] = useState<File | undefined>(undefined);
  const [hojaFile, setHojaFile] = useState<File | undefined>(undefined);

  // Este useEffect es crucial para actualizar los valores del formulario cuando cambia formData
  useEffect(() => {
    if (open && formData) {
      form.setFieldsValue({
        razonSocial: formData.razonSocial,
        rfc: formData.rfc
      });
    } else if (!isEditMode) {
      form.resetFields();
    }
  }, [open, formData, form, isEditMode]);

  const handleFinish = (values: Partial<Empresa>) => {
    onSubmit(values, logoFile, hojaFile);
  };

  const handleLogoUpload = (file: UploadFile) => {
    setLogoFile(file as unknown as File);
    return false; // Evita la subida automática
  };

  const handleHojaUpload = (file: UploadFile) => {
    setHojaFile(file as unknown as File);
    return false; // Evita la subida automática
  };

  return (
    <Modal
      title={isEditMode ? 'Editar Empresa' : 'Agregar Empresa'}
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
          onFinish={handleFinish}
          layout="vertical"
        >
          <Form.Item
            name="razonSocial"
            label="Razón Social"
            rules={[{ required: true, message: 'Ingrese la razón social' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="rfc"
            label="RFC"
            rules={[{ required: true, message: 'Ingrese el RFC' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Logo (imagen)">
            <Upload
              accept="image/*"
              beforeUpload={handleLogoUpload}
              maxCount={1}
              showUploadList={true}
            >
              <Button icon={<UploadOutlined />}>Subir Logo</Button>
            </Upload>
            {formData?.logoUrl && (
              <a href={formData.logoUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: 8 }}>
                Ver logo actual
              </a>
            )}
          </Form.Item>
          <Form.Item label="Hoja Membretada (.docx)">
            <Upload
              accept=".docx"
              beforeUpload={handleHojaUpload}
              maxCount={1}
              showUploadList={true}
            >
              <Button icon={<UploadOutlined />}>Subir Hoja Membretada</Button>
            </Upload>
            {formData?.hojaMembretadaUrl && (
              <a href={formData.hojaMembretadaUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: 8 }}>
                Ver hoja membretada actual
              </a>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditMode ? 'Actualizar' : 'Crear'}
            </Button>
            <Button onClick={onClose} style={{ marginLeft: 8 }}>
              Cancelar
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};

export default EmpresaModal;