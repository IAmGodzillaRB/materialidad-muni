import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Upload, Select, Spin, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Municipio } from '../../types/Municipio';
import { distritos } from '@/constans/DistritosOaxaca';

const { Option } = Select;

interface MunicipioModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<Municipio>, imagen?: File, hojaMembretada?: File) => void;
  formData: Municipio | null;
  isEditMode: boolean;
  loading: boolean;
}

const MunicipioModal: React.FC<MunicipioModalProps> = ({
  open,
  onClose,
  onSubmit,
  formData,
  isEditMode,
  loading,
}) => {
  const [form] = Form.useForm();
  const [imagenFile, setImagenFile] = useState<File | undefined>(undefined);
  const [hojaFile, setHojaFile] = useState<File | undefined>(undefined);

  // Cargar datos iniciales en modo edición
  useEffect(() => {
    if (open && formData) {
      form.setFieldsValue({
        denominacion: formData.denominacion,
        rfc: formData.rfc,
        codigoPostal: formData.codigoPostal,
        tipoVialidad: formData.tipoVialidad,
        nombreVialidad: formData.nombreVialidad,
        numeroExterior: formData.numeroExterior,
        numeroInterior: formData.numeroInterior,
        nombreColonia: formData.nombreColonia,
        nombreLocalidad: formData.nombreLocalidad,
        municipio: formData.municipio,
        distrito: formData.distrito,
        entreCalle: formData.entreCalle,
        otraCalle: formData.otraCalle,
      });
    } else if (!isEditMode) {
      form.resetFields();
    }
  }, [open, formData, form, isEditMode]);

  // Limpiar estado al cerrar
  useEffect(() => {
    if (!open) {
      setImagenFile(undefined);
      setHojaFile(undefined);
      form.resetFields();
    }
  }, [open, form]);

  // Manejo de subida de imagen
  const handleImagenUpload = (file: any) => {
    if (!file.type.startsWith('image/')) {
      message.error('Solo se permiten archivos de tipo imagen');
      return false;
    }
    setImagenFile(file);
    return false; // Evitar subida automática
  };

  // Manejo de subida de hoja membretada
  const handleHojaUpload = (file: any) => {
    if (!file.name.endsWith('.docx')) {
      message.error('Solo se permiten archivos de tipo Word (.docx)');
      return false;
    }
    setHojaFile(file);
    return false; // Evitar subida automática
  };

  // Enviar formulario
  const handleFinish = (values: Partial<Municipio>) => {
    onSubmit(values, imagenFile, hojaFile);
  };

  return (
    <Modal
      title={isEditMode ? 'Editar Municipio' : 'Agregar Municipio'}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Spin spinning={loading}>
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item
            name="denominacion"
            label="Denominación"
            rules={[{ required: true, message: 'Ingrese la denominación' }]}
          >
            <Input placeholder="Denominación" />
          </Form.Item>

          <Form.Item
            name="rfc"
            label="RFC"
            rules={[
              { required: true, message: 'Ingrese el RFC' },
              { pattern: /^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/, message: 'El RFC no tiene un formato válido' },
            ]}
          >
            <Input placeholder="RFC" />
          </Form.Item>

          <Form.Item
            name="codigoPostal"
            label="Código Postal"
            rules={[
              { required: true, message: 'Ingrese el código postal' },
              { pattern: /^\d{5}$/, message: 'El código postal debe tener 5 dígitos' },
            ]}
          >
            <Input placeholder="Código Postal" maxLength={5} />
          </Form.Item>

          <Form.Item name="tipoVialidad" label="Tipo de Vialidad">
            <Select placeholder="Seleccione un tipo de vialidad">
              <Option value="Avenida">Avenida</Option>
              <Option value="Calle">Calle</Option>
              <Option value="Callejón">Callejón</Option>
              <Option value="Boulevard">Boulevard</Option>
              <Option value="Privada">Privada</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="nombreVialidad"
            label="Nombre de Vialidad"
            rules={[{ required: true, message: 'Ingrese el nombre de la vialidad' }]}
          >
            <Input placeholder="Nombre de la vialidad" />
          </Form.Item>

          <Form.Item
            name="numeroExterior"
            label="Número Exterior"
            rules={[{ required: true, message: 'Ingrese el número exterior' }]}
          >
            <Input placeholder="Número exterior" />
          </Form.Item>

          <Form.Item name="numeroInterior" label="Número Interior">
            <Input placeholder="Número interior" />
          </Form.Item>

          <Form.Item name="nombreColonia" label="Nombre de la Colonia">
            <Input placeholder="Nombre de la colonia" />
          </Form.Item>

          <Form.Item
            name="nombreLocalidad"
            label="Nombre de la Localidad"
            rules={[{ required: true, message: 'Ingrese el nombre de la localidad' }]}
          >
            <Input placeholder="Nombre de la localidad" />
          </Form.Item>

          <Form.Item
            name="distrito"
            label="Distrito"
            rules={[{ required: true, message: 'Seleccione un distrito' }]}
          >
            <Select placeholder="Seleccione el distrito">
              {distritos.map((distrito) => (
                <Option key={distrito} value={distrito}>
                  {distrito}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="municipio"
            label="Nombre del Municipio"
            rules={[{ required: true, message: 'Ingrese el nombre del municipio' }]}
          >
            <Input placeholder="Nombre del municipio" />
          </Form.Item>

          <Form.Item name="entreCalle" label="Entre Calle">
            <Input placeholder="Nombre de la primera calle de referencia" />
          </Form.Item>

          <Form.Item name="otraCalle" label="Otra Calle">
            <Input placeholder="Nombre de la segunda calle de referencia" />
          </Form.Item>

          <Form.Item label="Imagen">
            <Upload
              accept="image/*"
              beforeUpload={handleImagenUpload}
              maxCount={1}
              showUploadList={true}
            >
              <Button icon={<UploadOutlined />}>
                {isEditMode && formData?.imagenURL ? 'Cambiar Imagen' : 'Subir Imagen'}
              </Button>
            </Upload>
            {formData?.imagenURL && !imagenFile && (
              <a href={formData.imagenURL} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: 8 }}>
                Ver imagen actual
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
              <Button icon={<UploadOutlined />}>
                {isEditMode && formData?.hojaMembretadaUrl ? 'Cambiar Hoja Membretada' : 'Subir Hoja Membretada'}
              </Button>
            </Upload>
            {formData?.hojaMembretadaUrl && !hojaFile && (
              <a href={formData.hojaMembretadaUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: 8 }}>
                Ver hoja membretada actual
              </a>
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
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

export default MunicipioModal;