import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Upload, Select, Steps, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { subirImagenYGuardarURL } from '../../services/storageService';
import { Municipio } from '../../types/Municipio';
import { distritos } from '@/constans/DistritosOaxaca';

const { Step } = Steps;
const { Option } = Select;

interface MunicipioModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Municipio) => void;
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
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);

  // Cargar los datos del municipio cuando estamos en modo edición
  useEffect(() => {
    if (open && isEditMode && formData) {
      // Si tenemos una imagen previa, configuramos el estado de la imagen
      if (formData.imagen) {
        setImageUrl(formData.imagen);
        setFileList([
          {
            uid: '-1',
            name: 'Imagen actual',
            status: 'done',
            url: formData.imagen
          }
        ]);
      }

      // Inicializar el formulario con los datos existentes
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
        entidadFederativa: formData.entidadFederativa,
        municipio: formData.municipio,
        entreCalle: formData.entreCalle,
        otraCalle: formData.otraCalle
      });
    }
  }, [open, isEditMode, formData, form]);

  // Limpiar el formulario cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      setCurrentStep(0);
      setImageUrl(null);
      setFileList([]);
      form.resetFields();
    }
  }, [open, form]);

  // Manejar la subida de la imagen
  const handleImageUpload = async (file: File) => {
    try {
      const url = await subirImagenYGuardarURL(file);
      setImageUrl(url);
      setFileList([{ uid: '-1', name: file.name, status: 'done', url }]);
      message.success('Imagen subida correctamente');
      setCurrentStep(1);
      return false; // Prevenir la subida automática de Upload
    } catch (error) {
      message.error('Error al subir la imagen');
      return false;
    }
  };

  // Función para omitir el paso de la imagen y pasar al formulario
  const skipImageStep = () => {
    setCurrentStep(1);
  };

  // Manejar el envío del formulario
  const handleSubmit = (values: Municipio) => {
    // Si estamos editando y no cambiamos la imagen, usar la imagen existente
    const finalImageUrl = imageUrl || (isEditMode ? formData?.imagen : null);

    if (finalImageUrl) {
      const municipioCompleto = { ...values, imagen: finalImageUrl };
      onSubmit(municipioCompleto);
    } else {
      message.error('Debes subir una imagen antes de continuar');
    }
  };

  return (
    <Modal
      title={isEditMode ? 'Editar Municipio' : 'Agregar Municipio'}
      open={open}
      onCancel={() => {
        setCurrentStep(0);
        setImageUrl(null);
        setFileList([]);
        form.resetFields();
        onClose();
      }}
      footer={null}
      centered
      width={800}
    >
      {/* Pasos del modal */}
      <Steps current={currentStep} style={{ marginBottom: '24px' }}>
        <Step title="Subir Imagen" />
        <Step title="Completar Formulario" />
      </Steps>

      {/* Paso 1: Subir Imagen */}
      {currentStep === 0 && (
        <div>
          {isEditMode && formData?.imagen && (
            <div style={{ marginBottom: '16px', textAlign: 'center' }}>
              <h4>Imagen actual</h4>
              <img
                src={formData.imagen}
                alt="Imagen actual del municipio"
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginBottom: '16px' }}
              />
            </div>
          )}

          <Upload
            beforeUpload={handleImageUpload}
            fileList={fileList}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>
              {isEditMode ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
            </Button>
          </Upload>

          {isEditMode && formData?.imagen && (
            <div style={{ marginTop: '16px', textAlign: 'right' }}>
              <Button type="primary" onClick={skipImageStep}>
                Omitir este paso (mantener imagen actual)
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Paso 2: Completar Formulario */}
      {currentStep === 1 && (
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={formData || {}}>
          {/* Campo para la imagen (solo vista previa) */}
          {imageUrl && (
            <div style={{ marginBottom: '16px', textAlign: 'center' }}>
              <img
                src={imageUrl}
                alt="Vista previa de la imagen"
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
              />
            </div>
          )}
          {!imageUrl && isEditMode && formData?.imagen && (
            <div style={{ marginBottom: '16px', textAlign: 'center' }}>
              <img
                src={formData.imagen}
                alt="Imagen actual del municipio"
                style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }}
              />
            </div>
          )}

          {/* Otros campos del formulario */}
          <Form.Item
            label="Denominación/Razón Social"
            name="denominacion"
            rules={[{ required: true, message: 'Ingrese la denominación' }]}
          >
            <Input placeholder="Denominación o Razón Social" />
          </Form.Item>

          <Form.Item
            label="RFC"
            name="rfc"
            rules={[
              { required: true, message: 'Ingrese el RFC' },
              {
                pattern: /^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/,
                message: 'El RFC no tiene un formato válido',
              },
            ]}
          >
            <Input placeholder="RFC" />
          </Form.Item>

          <Form.Item
            label="Código Postal"
            name="codigoPostal"
            rules={[
              { required: true, message: 'Ingrese el código postal' },
              { pattern: /^\d{5}$/, message: 'El código postal debe tener 5 dígitos' },
            ]}
          >
            <Input placeholder="Código Postal" maxLength={5} />
          </Form.Item>

          <Form.Item
            label="Tipo de Vialidad"
            name="tipoVialidad"
          >
            <Select placeholder="Seleccione un tipo de vialidad">
              <Option value="Avenida">Avenida</Option>
              <Option value="Calle">Calle</Option>
              <Option value="Callejón">Callejón</Option>
              <Option value="Boulevard">Boulevard</Option>
              <Option value="Privada">Privada</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Nombre de Vialidad"
            name="nombreVialidad"
            rules={[{ required: true, message: 'Ingrese el nombre de la vialidad' }]}
          >
            <Input placeholder="Nombre de la vialidad" />
          </Form.Item>

          <Form.Item
            label="Número Exterior"
            name="numeroExterior"
            rules={[{ required: true, message: 'Ingrese el número exterior' }]}
          >
            <Input placeholder="Número exterior" />
          </Form.Item>

          <Form.Item
            label="Número Interior (Opcional)"
            name="numeroInterior"
          >
            <Input placeholder="Número interior" />
          </Form.Item>

          <Form.Item
            label="Nombre de la Colonia (Opcional)"
            name="nombreColonia"
          >
            <Input placeholder="Nombre de la colonia" />
          </Form.Item>

          <Form.Item
            label="Nombre de la Localidad"
            name="nombreLocalidad"
            rules={[{ required: true, message: 'Ingrese el nombre de la localidad' }]}
          >
            <Input placeholder="Nombre de la localidad" />
          </Form.Item>

          <Form.Item
            label="Entidad Federativa"
            name="entidadFederativa"
            rules={[{ required: true, message: 'Ingrese la entidad federativa' }]}
          >
            <Select placeholder="Seleccione la entidad federativa">
              <Option value="Aguascalientes">Aguascalientes</Option>
              <Option value="Baja California">Baja California</Option>
              <Option value="Baja California Sur">Baja California Sur</Option>
              <Option value="Campeche">Campeche</Option>
              <Option value="Chiapas">Chiapas</Option>
              <Option value="Chihuahua">Chihuahua</Option>
              <Option value="Ciudad de México">Ciudad de México</Option>
              <Option value="Coahuila">Coahuila</Option>
              <Option value="Colima">Colima</Option>
              <Option value="Durango">Durango</Option>
              <Option value="Estado de México">Estado de México</Option>
              <Option value="Guanajuato">Guanajuato</Option>
              <Option value="Guerrero">Guerrero</Option>
              <Option value="Hidalgo">Hidalgo</Option>
              <Option value="Jalisco">Jalisco</Option>
              <Option value="Michoacán">Michoacán</Option>
              <Option value="Morelos">Morelos</Option>
              <Option value="Nayarit">Nayarit</Option>
              <Option value="Nuevo León">Nuevo León</Option>
              <Option value="Oaxaca">Oaxaca</Option>
              <Option value="Puebla">Puebla</Option>
              <Option value="Querétaro">Querétaro</Option>
              <Option value="Quintana Roo">Quintana Roo</Option>
              <Option value="San Luis Potosí">San Luis Potosí</Option>
              <Option value="Sinaloa">Sinaloa</Option>
              <Option value="Sonora">Sonora</Option>
              <Option value="Tabasco">Tabasco</Option>
              <Option value="Tamaulipas">Tamaulipas</Option>
              <Option value="Tlaxcala">Tlaxcala</Option>
              <Option value="Veracruz">Veracruz</Option>
              <Option value="Yucatán">Yucatán</Option>
              <Option value="Zacatecas">Zacatecas</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Distrito"
            name="distrito"
            rules={[{ required: true, message: 'Seleccione un distritro' }]}
          >
            <Select placeholder="Seleccione el distrito al que corresponde">
              {distritos.map((distrito) => (
                <Option key={distrito} value={distrito}>
                  {distrito}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Nombre del Municipio"
            name="municipio"
            rules={[{ required: true, message: 'Ingrese el nombre del municipio' }]}
          >
            <Input placeholder="Nombre del municipio" />
          </Form.Item>

          <Form.Item
            label="Entre Calle (Opcional)"
            name="entreCalle"
          >
            <Input placeholder="Nombre de la primera calle de referencia" />
          </Form.Item>

          <Form.Item
            label="Otra Calle (Opcional)"
            name="otraCalle"
          >
            <Input placeholder="Nombre de la segunda calle de referencia" />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <Button type="default" onClick={() => setCurrentStep(0)}>
                Volver
              </Button>
              <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
                {isEditMode ? 'Actualizar' : 'Guardar'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default MunicipioModal;