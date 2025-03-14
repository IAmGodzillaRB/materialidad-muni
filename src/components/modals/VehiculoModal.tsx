import React, { useEffect } from 'react';
import { Modal, Form, Input, Select } from 'antd';
import { Vehiculo } from '@/types/Vehiculo'; // Alias @/
import { marcasComerciales } from '@/constans/marcasVehiculos'; // Alias @/

interface VehiculoModalProps {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: Vehiculo) => void;
  initialValues?: Vehiculo;
}

const VehiculoModal: React.FC<VehiculoModalProps> = ({ visible, onCancel, onSave, initialValues }) => {
  const [form] = Form.useForm();

  // Actualizar valores iniciales cuando cambian o el modal se abre
  useEffect(() => {
    if (visible) {
      form.resetFields(); // Resetea el formulario para evitar datos residuales
      form.setFieldsValue(initialValues || { marca: '', modelo: '', año: '', placa: '', kmPorLitro: '' });
    }
  }, [visible, initialValues, form]);

  const currentYear = new Date().getFullYear(); // 2025

  return (
    <Modal
      title={initialValues ? 'Editar Vehículo' : 'Agregar Vehículo'}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Guardar"
      cancelText="Cancelar"
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSave}
        initialValues={initialValues || { marca: '', modelo: '', año: '', placa: '', kmPorLitro: '' }}
      >
        {/* Campo de marca con Select */}
        <Form.Item
          name="marca"
          label="Marca"
          rules={[{ required: true, message: 'Por favor, selecciona una marca' }]}
        >
          <Select placeholder="Selecciona una marca" showSearch optionFilterProp="children">
            {marcasComerciales.map((marca) => (
              <Select.Option key={marca} value={marca}>
                {marca}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Campo de modelo */}
        <Form.Item
          name="modelo"
          label="Modelo"
          rules={[{ required: true, message: 'Por favor, ingresa el modelo' }]}
        >
          <Input placeholder="Ej. Corolla" />
        </Form.Item>

        {/* Campo de año */}
        <Form.Item
          name="año"
          label="Año"
          rules={[
            { required: true, message: 'Por favor, ingresa el año' },
            {
              validator: (_, value) => {
                const numValue = Number(value);
                if (isNaN(numValue) || numValue < 1900 || numValue > currentYear) {
                  return Promise.reject(new Error(`El año debe estar entre 1900 y ${currentYear}`));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input type="number" placeholder={`Ej. ${currentYear}`} />
        </Form.Item>

        {/* Campo de placa */}
        <Form.Item
          name="placa"
          label="Placa"
          rules={[{ required: true, message: 'Por favor, ingresa la placa' }]}
        >
          <Input placeholder="Ej. ABC-123" />
        </Form.Item>

        {/* Campo de kmPorLitro */}
        <Form.Item
          name="kmPorLitro"
          label="Kilómetros por litro"
          rules={[
            { required: true, message: 'Por favor, ingresa los km por litro' },
            {
              validator: (_, value) => {
                const numValue = Number(value);
                if (isNaN(numValue) || numValue <= 0) {
                  return Promise.reject(new Error('Debe ser mayor a 0'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input type="number" step="0.1" placeholder="Ej. 15.5" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VehiculoModal;