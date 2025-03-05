import React, { useState } from "react";
import { Modal, Form, Input, Button, Upload, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface MunicipioModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  formData: {
    id?: string;
    rfc: string;
    denominacion: string;
    codigoPostal: string;
    nombreVialidad: string;
    numeroInterior?: string;
    nombreLocalidad: string;
    entidadFederativa: string;
    tipoVialidad?: string;
    numeroExterior: string;
    nombreColonia?: string;
    municipio: string;
    entreCalle?: string;
    otraCalle?: string;
    imagen?: string;
    fechaCreacion?: string;
  };
  isEditMode: boolean;
  loading: boolean;
}

const { Option } = Select;

const MunicipioModal: React.FC<MunicipioModalProps> = ({
  open,
  onClose,
  onSubmit,
  formData,
  isEditMode,
  loading,
}) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<any[]>([]);
  const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false);

  // Resetear el formulario cuando se abra el modal o cambien los datos
  React.useEffect(() => {
    if (open) {
      form.setFieldsValue(formData);
      if (formData.imagen) {
        setFileList([{ uid: "-1", name: "imagen", status: "done", url: formData.imagen }]);
        setIsImageUploaded(true);
      } else {
        setFileList([]);
        setIsImageUploaded(false);
      }
    }
  }, [formData, open]);

  // Función para manejar la subida de la imagen
  const handleImageUpload = async (file: File): Promise<string> => {
    const storage = getStorage();
    const fileName = file.name || `image_${Date.now()}`;
    const storageRef = ref(storage, `municipios/${Date.now()}_${fileName}`);

    const metadata = {
      contentType: file.type,
    };

    try {
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      throw error;
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (values: any) => {
    try {
      // Subir imagen si existe
      if (fileList.length > 0 && fileList[0].originFileObj) {
        message.loading('Subiendo imagen...', 0);
        const imageUrl = await handleImageUpload(fileList[0].originFileObj);
        message.destroy();
        values.imagen = imageUrl; // Asignar la URL de la imagen al campo `imagen`
      } else if (formData.imagen) {
        values.imagen = formData.imagen; // Mantener la imagen existente si no se subió una nueva
      }

      // Asegúrate de que el ID esté presente en modo edición
      if (isEditMode && formData.id) {
        values.id = formData.id;
      }

      // Limpiar datos antes de enviar a Firestore
      const cleanedData = Object.fromEntries(
        Object.entries(values).filter(([_, value]) => value !== undefined && value !== '')
      );

      onSubmit(cleanedData); // Enviar los datos limpios
    } catch (error) {
      console.error("Error al procesar el formulario:", error);
      message.error("Error al procesar el formulario");
    }
  };

  // Limpiar el formulario y el estado de la imagen al cerrar el modal
  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    setIsImageUploaded(false);
    onClose();
  };

  // Función de validación para el archivo subido
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isValidSize = file.size <= 2 * 1024 * 1024; // 2 MB

    if (!isImage) {
      message.error("Solo se permiten archivos de imagen.");
      return Upload.LIST_IGNORE;
    }

    if (!isValidSize) {
      message.error("La imagen debe ser de 2MB o menos.");
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  // Función para manejar la subida personalizada
  const customRequest = async ({ file, onSuccess, onError }: any) => {
    try {
      const url = await handleImageUpload(file);
      setFileList([{ uid: file.uid, name: file.name, status: 'done', url }]);
      setIsImageUploaded(true);
      form.setFieldsValue({ imagen: url }); // Asignar la URL al campo `imagen` del formulario
      onSuccess(url, file);
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      onError(error);
    }
  };

  return (
    <Modal
      title={isEditMode ? "Editar Municipio" : "Agregar Municipio"}
      open={open}
      onCancel={handleClose}
      footer={null}
      centered
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Campos del formulario */}
        <Form.Item
          label="RFC"
          name="rfc"
          rules={[{ required: true, message: "Ingrese el RFC" }, { pattern: /^[A-Z&Ñ]{3,4}\d{6}[A-Z0-9]{3}$/, message: "El RFC no tiene un formato válido" }]}
        >
          <Input placeholder="RFC" />
        </Form.Item>

        <Form.Item label="Denominación/Razón Social" name="denominacion" rules={[{ required: true, message: "Ingrese la denominación" }]}>
          <Input placeholder="Denominación o Razón Social" />
        </Form.Item>

        <Form.Item
          label="Código Postal"
          name="codigoPostal"
          rules={[{ required: true, message: "Ingrese el código postal" }, { pattern: /^\d{5}$/, message: "El código postal debe tener 5 dígitos" }]}
        >
          <Input placeholder="Código Postal" maxLength={5} />
        </Form.Item>

        <Form.Item label="Tipo de Vialidad" name="tipoVialidad">
          <Select placeholder="Seleccione un tipo de vialidad">
            <Option value="Avenida">Avenida</Option>
            <Option value="Calle">Calle</Option>
            <Option value="Callejón">Callejón</Option>
            <Option value="Boulevard">Boulevard</Option>
            <Option value="Privada">Privada</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Nombre de Vialidad" name="nombreVialidad" rules={[{ required: true, message: "Ingrese el nombre de la vialidad" }]}>
          <Input placeholder="Nombre de la vialidad" />
        </Form.Item>

        <Form.Item label="Número Exterior" name="numeroExterior" rules={[{ required: true, message: "Ingrese el número exterior" }]}>
          <Input placeholder="Número exterior" />
        </Form.Item>

        <Form.Item label="Número Interior (Opcional)" name="numeroInterior">
          <Input placeholder="Número interior" />
        </Form.Item>

        <Form.Item label="Nombre de la Colonia (Opcional)" name="nombreColonia">
          <Input placeholder="Nombre de la colonia" />
        </Form.Item>

        <Form.Item label="Nombre de la Localidad" name="nombreLocalidad" rules={[{ required: true, message: "Ingrese el nombre de la localidad" }]}>
          <Input placeholder="Nombre de la localidad" />
        </Form.Item>

        <Form.Item label="Entidad Federativa" name="entidadFederativa" rules={[{ required: true, message: "Seleccione la entidad federativa" }]}>
          <Select placeholder="Seleccione la entidad federativa">
            {/* Lista completa de entidades federativas */}
            <Option value="Aguascalientes">Aguascalientes</Option>
            <Option value="Baja California">Baja California</Option>
            <Option value="Baja California Sur">Baja California Sur</Option>
            <Option value="Campeche">Campeche</Option>
            <Option value="Chiapas">Chiapas</Option>
            <Option value="Chihuahua">Chihuahua</Option>
            <Option value="Coahuila">Coahuila</Option>
            <Option value="Colima">Colima</Option>
            <Option value="Durango">Durango</Option>
            <Option value="Guanajuato">Guanajuato</Option>
            <Option value="Guerrero">Guerrero</Option>
            <Option value="Hidalgo">Hidalgo</Option>
            <Option value="Jalisco">Jalisco</Option>
            <Option value="Estado de México">Estado de México</Option>
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

        <Form.Item label="Nombre del Municipio" name="municipio" rules={[{ required: true, message: "Ingrese el nombre del municipio" }]}>
          <Input placeholder="Nombre del municipio" />
        </Form.Item>

        <Form.Item label="Entre Calle (Opcional)" name="entreCalle">
          <Input placeholder="Nombre de la primera calle de referencia" />
        </Form.Item>

        <Form.Item label="Otra Calle (Opcional)" name="otraCalle">
          <Input placeholder="Nombre de la segunda calle de referencia" />
        </Form.Item>

        {/* Campo para la imagen */}
        <Form.Item label="Imagen" name="imagen">
          <Upload
            fileList={fileList}
            beforeUpload={beforeUpload}
            customRequest={customRequest}
            onRemove={() => {
              setFileList([]);
              setIsImageUploaded(false);
              form.setFieldsValue({ imagen: undefined }); // Limpiar el campo `imagen` del formulario
            }}
            maxCount={1}
            accept="image/*"
          >
            <Button icon={<UploadOutlined />}>Subir Imagen</Button>
          </Upload>
        </Form.Item>

        {/* Botones de acción */}
        <Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button type="default" danger onClick={handleClose}>
              Cancelar
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading || !isImageUploaded} // Deshabilitar si no hay imagen subida
            >
              {isEditMode ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MunicipioModal;