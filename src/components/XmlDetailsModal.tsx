import React from 'react';
import { Modal, Descriptions } from 'antd';

interface XmlDetailsModalProps {
    visible: boolean;
    onClose: () => void;
    details: any;
}

const XmlDetailsModal: React.FC<XmlDetailsModalProps> = ({ visible, onClose, details }) => {
    if (!details) {
        return null; // No renderizar nada si no hay detalles
    }

    return (
        <Modal
            title="Detalles del CFDI"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
        >
            <Descriptions bordered column={1}>
                <Descriptions.Item label="Emisor">
                    <strong>Nombre:</strong> {details.emisor.nombre}<br />
                    <strong>RFC:</strong> {details.emisor.rfc}
                </Descriptions.Item>
                <Descriptions.Item label="Receptor">
                    <strong>Nombre:</strong> {details.receptor.nombre}<br />
                    <strong>RFC:</strong> {details.receptor.rfc}
                </Descriptions.Item>
                <Descriptions.Item label="Conceptos">
                    {details.conceptos && details.conceptos.length > 0 ? (
                        details.conceptos.map((concepto: any, index: number) => (
                            <div key={index}>
                                <strong>Descripción:</strong> {concepto.descripcion}<br />
                                <strong>Cantidad:</strong> {concepto.cantidad}<br />
                                <strong>Valor Unitario:</strong> {concepto.valorUnitario}<br />
                                <strong>Importe:</strong> {concepto.importe}<br />
                                {concepto.impuestos && concepto.impuestos.length > 0 && (
                                    <div>
                                        <strong>Impuestos:</strong>
                                        {concepto.impuestos.map((impuesto: any, i: number) => (
                                            <div key={i}>
                                                <strong>Impuesto:</strong> {impuesto.Impuesto}<br />
                                                <strong>Importe:</strong> {impuesto.Importe}<br />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <hr />
                            </div>
                        ))
                    ) : (
                        <p>No hay conceptos disponibles.</p>
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="Impuestos Generales">
                    {details.impuestos && details.impuestos.length > 0 ? (
                        details.impuestos.map((impuesto: any, index: number) => (
                            <div key={index}>
                                <strong>Impuesto:</strong> {impuesto.impuesto}<br />
                                <strong>Importe:</strong> {impuesto.importe}<br />
                                <hr />
                            </div>
                        ))
                    ) : (
                        <p>No hay impuestos generales disponibles.</p>
                    )}
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default XmlDetailsModal;