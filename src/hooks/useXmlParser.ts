import { useState } from 'react';
import { XMLParser } from 'fast-xml-parser';

const useXmlParser = () => {
    const [xmlData, setXmlData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const xml = e.target?.result as string;

            // Configurar el parser
            const parser = new XMLParser({
                ignoreAttributes: false, // No ignorar atributos
                attributeNamePrefix: '', // No agregar prefijo a los atributos
                removeNSPrefix: true, // Eliminar namespaces de los nombres de los nodos
            });

            try {
                // Convertir el XML a un objeto JSON
                const result = parser.parse(xml);
                console.log('XML procesado:', result); // Log del XML procesado
                setXmlData(result);
                setError(null);
            } catch (err) {
                setError('Error al procesar el archivo XML');
                console.error('Error parsing XML:', err);
            }
        };
        reader.readAsText(file);
    };

    // Extraer detalles específicos del XML
    const getDetails = () => {
        if (!xmlData) return null;

        // Acceder a los nodos correctos del XML
        const comprobante = xmlData['cfdi:Comprobante'] || xmlData.Comprobante;
        const emisor = comprobante?.Emisor;
        const receptor = comprobante?.Receptor;
        const conceptos = comprobante?.Conceptos?.Concepto || [];
        const impuestos = comprobante?.Impuestos?.Traslados?.Traslado || [];
        const fechaISO = comprobante?.Fecha;
        
        const fechaFormateada = fechaISO
        ? new Date(fechaISO).toLocaleDateString('es-MX', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
          })
        : 'N/A'; // Extraer la fecha del XML

        console.log('Comprobante:', comprobante); // Log del comprobante
        console.log('Emisor:', emisor); // Log del emisor
        console.log('Receptor:', receptor); // Log del receptor
        console.log('Conceptos:', conceptos); // Log de los conceptos
        console.log('Impuestos:', impuestos); // Log de los impuestos
        console.log('Fecha:', fechaISO); // Log de la fecha

        // Convertir conceptos a un array si no lo es
        const conceptosArray = Array.isArray(conceptos) ? conceptos : [conceptos];

        // Convertir impuestos a un array si no lo es
        const impuestosArray = Array.isArray(impuestos) ? impuestos : [impuestos];

        return {
            fecha: fechaFormateada, 
            emisor: {
                nombre: emisor?.Nombre || 'N/A',
                rfc: emisor?.Rfc || 'N/A',
            },
            receptor: {
                nombre: receptor?.Nombre || 'N/A',
                rfc: receptor?.Rfc || 'N/A',
            },
            conceptos: conceptosArray.map((concepto: any) => ({
                descripcion: concepto?.Descripcion || 'N/A',
                cantidad: concepto?.Cantidad || 'N/A',
                valorUnitario: concepto?.ValorUnitario || 'N/A',
                importe: concepto?.Importe || 'N/A',
            })),
            impuestos: impuestosArray.map((impuesto: any) => ({
                impuesto: impuesto?.Impuesto || 'N/A',
                importe: impuesto?.Importe || 'N/A',
            })),
            total: comprobante?.Total || 'N/A', // Incluir el total del XML
        };
    };


    return { xmlData, error, handleFileUpload, getDetails };
};

export default useXmlParser;