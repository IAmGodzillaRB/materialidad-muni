import React from "react";
import { Modal, Form, Input, Button } from "antd";

interface MunicipioModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  formData: {
    id?: string;
    nombre: string;
    rfc: string;
    direccion: string;
    codigoPostal: string;
  };
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
  const [form] = Form.useForm(); // Crear la instancia del formulario

  // Resetear el formulario cuando se abra el modal o cambien los datos
  React.useEffect(() => {
    if (open) {
      form.setFieldsValue(formData); // Establecer los valores iniciales del formulario
    }
  }, [formData, open]);

  return (
    <Modal
      title={isEditMode ? "Editar Municipio" : "Agregar Municipio"}
      open={open}
      onCancel={() => {
        form.resetFields(); // Limpiar el formulario al cerrar el modal
        onClose();
      }}
      footer={null}
      centered
      width={400}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Nombre"
          name="nombre"
          rules={[{ required: true, message: "Ingrese el nombre del municipio" }]}
        >
          <Input placeholder="Nombre del municipio" />
        </Form.Item>

        <Form.Item
          label="RFC"
          name="rfc"
          rules={[{ required: true, message: "Ingrese el RFC" }]}
        >
          <Input placeholder="RFC" />
        </Form.Item>

        <Form.Item
          label="Dirección"
          name="direccion"
          rules={[{ required: true, message: "Ingrese la dirección" }]}
        >
          <Input placeholder="Dirección" />
        </Form.Item>

        <Form.Item
          label="Código Postal"
          name="codigoPostal"
          rules={[
            { required: true, message: "Ingrese el código postal" },
            { pattern: /^\d{5}$/, message: "El código postal debe tener 5 dígitos" },
          ]}
        >
          <Input placeholder="Código Postal" maxLength={5} />
        </Form.Item>

        <Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button type="default" danger onClick={onClose}>
              Cancelar
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
              {isEditMode ? "Actualizar" : "Guardar"}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MunicipioModal;