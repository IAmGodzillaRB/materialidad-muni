import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useXmlParser from '../hooks/useXmlParser';
import XmlDetailsModal from './XmlDetailsModal';
import createWordDocument from '../utils/createWordDocument'; // Importar la función

const XmlUploader: React.FC = () => {
    const { xmlData, error, handleFileUpload, getDetails } = useXmlParser();
    const [modalVisible, setModalVisible] = useState(false);

    const beforeUpload = (file: File) => {
        handleFileUpload(file);
        return false; // Evita que Ant Design suba el archivo automáticamente
    };

    const details = getDetails();

    // Función para generar el Word
    const handleGenerateWord = () => {
        if (details) {
            const wordData = {
                emisor: {
                    nombre: details.emisor.nombre,
                    rfc: details.emisor.rfc,
                },
                receptor: {
                    nombre: details.receptor.nombre,
                    rfc: details.receptor.rfc,
                },
                conceptos: details.conceptos,
                impuestos: details.impuestos,
                total: "85,000.00", // Aquí puedes calcular el total si es necesario
            };
            createWordDocument(wordData); // Llamar a la función
        } else {
            alert('Primero sube un archivo XML.');
        }
    };

    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Lector de CFDI del SAT</h1>
            <Upload
                accept=".xml"
                beforeUpload={beforeUpload}
                showUploadList={false}
            >
                <Button icon={<UploadOutlined />}>Subir archivo XML</Button>
            </Upload>

            {error && (
                <p className="text-red-500 mt-4">{error}</p>
            )}

            {xmlData && (
                <div className="mt-6">
                    <Button
                        type="primary"
                        onClick={() => setModalVisible(true)}
                        style={{ marginRight: '10px' }} // Espacio entre botones
                    >
                        Ver detalles
                    </Button>
                    <Button
                        type="primary"
                        onClick={handleGenerateWord}
                    >
                        Descargar Word
                    </Button>
                </div>
            )}

            {details && (
                <XmlDetailsModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    details={details}
                />
            )}
        </div>
    );
};

export default XmlUploader;