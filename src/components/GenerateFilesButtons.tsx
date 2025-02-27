import React from 'react';
import createWordDocument from '../utils/createWordDocument';

import useXmlParser from '../hooks/useXmlParser';

const GenerateFilesButtons: React.FC = () => {
    const { xmlData } = useXmlParser();

    const handleGenerateWord = () => {
        if (xmlData) {
            const details = {
                fecha: xmlData.Comprobante.Fecha,
                emisor: {
                    nombre: xmlData.Comprobante.Emisor.Nombre,
                    rfc: xmlData.Comprobante.Emisor.Rfc,
                },
                receptor: {
                    nombre: xmlData.Comprobante.Receptor.Nombre,
                    rfc: xmlData.Comprobante.Receptor.Rfc,
                },
                conceptos: xmlData.Comprobante.Conceptos.Concepto.map((concepto: any) => ({
                    descripcion: concepto.Descripcion,
                    cantidad: concepto.Cantidad,
                    valorUnitario: concepto.ValorUnitario,
                    importe: concepto.Importe,
                })),
                impuestos: xmlData.Comprobante.Impuestos.Traslados.Traslado.map((impuesto: any) => ({
                    impuesto: impuesto.Impuesto,
                    importe: impuesto.Importe,
                })),
                total: xmlData.Comprobante.Total,
            };
            createWordDocument(details);
        } else {
            alert('Primero sube un archivo XML.');
        }
    };

    return (
        <div style={{ margin: '20px' }}>
            <button
                onClick={handleGenerateWord}
                style={{
                    padding: '10px 20px',
                    marginRight: '10px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Descargar Word
            </button>
        </div>
    );
};

export default GenerateFilesButtons;