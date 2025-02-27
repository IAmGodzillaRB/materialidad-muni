import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from 'docx';

interface XmlData {
    fecha: string;
    emisor: {
        nombre: string;
        rfc: string;
    };
    receptor: {
        nombre: string;
        rfc: string;
    };
    conceptos: Array<{
        descripcion: string;
        cantidad: string;
        valorUnitario: string;
        importe: string;
    }>;
    impuestos: Array<{
        impuesto: string;
        importe: string;
    }>;
    total: string;
}

const createWordDocument = (xmlData: XmlData) => {
    // Extraer datos del XML
    const { fecha, emisor, conceptos, impuestos, total } = xmlData;

    // Crear el contenido del documento
    const doc = new Document({
        sections: [
            {
                children: [
                    // Fecha y lugar
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Oaxaca de Juárez, Oaxaca; a ${fecha}.`,
                                bold: true,
                            }),
                        ],
                    }),
                    // Asunto
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "ASUNTO: COTIZACIÓN",
                                bold: true,
                            }),
                        ],
                        spacing: { before: 200, after: 200 }, // Espaciado
                    }),
                    // Destinatario
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "SANTA MARÍA HUATULCO,",
                                bold: true,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "C. José Antonio Pérez",
                                bold: true,
                            }),
                        ],
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "PRESENTE.",
                                bold: true,
                            }),
                        ],
                        spacing: { before: 200, after: 200 }, // Espaciado
                    }),
                    // Cuerpo del documento
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Por este medio presento la cotización solicitada a "${emisor.nombre}" (RFC: ${emisor.rfc}) consistente en los siguientes servicios:`,
                            }),
                        ],
                        spacing: { after: 200 }, // Espaciado
                    }),
                    // Tabla de conceptos
                    new Table({
                        width: { size: 100, type: WidthType.PERCENTAGE },
                        rows: [
                            // Encabezado de la tabla
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph("CANTIDAD")],
                                        width: { size: 20, type: WidthType.PERCENTAGE },
                                    }),
                                    new TableCell({
                                        children: [new Paragraph("CONCEPTO")],
                                        width: { size: 50, type: WidthType.PERCENTAGE },
                                    }),
                                    new TableCell({
                                        children: [new Paragraph("SUBTOTAL")],
                                        width: { size: 30, type: WidthType.PERCENTAGE },
                                    }),
                                ],
                            }),
                            // Filas de conceptos
                            ...conceptos.map((concepto) => (
                                new TableRow({
                                    children: [
                                        new TableCell({
                                            children: [new Paragraph(concepto.cantidad)],
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(concepto.descripcion)],
                                        }),
                                        new TableCell({
                                            children: [new Paragraph(`\$${concepto.importe}`)],
                                        }),
                                    ],
                                })
                            )),
                            // Impuestos
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph("")],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph("I.V.A. 16.00%")],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(`\$${impuestos[0]?.importe || '0.00'}`)],
                                    }),
                                ],
                            }),
                            // Total
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph("")],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph("TOTAL")],
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(`\$${total}`)],
                                    }),
                                ],
                            }),
                        ],
                    }),
                    // Texto final
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `La prestación del servicio tiene un costo total de \$${total} (${total} pesos 00/100 M.N.), IVA incluido.`,
                            }),
                        ],
                        spacing: { before: 200, after: 200 }, // Espaciado
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "Lo anterior, para su conocimiento y ponernos a su servicio.",
                            }),
                        ],
                        spacing: { after: 200 }, // Espaciado
                    }),
                    // Firma
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "A T E N T A M E N T E",
                                bold: true,
                            }),
                        ],
                        alignment: "center", // Centrar el texto
                        spacing: { before: 200, after: 200 }, // Espaciado
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `C. ${emisor.nombre}`,
                                bold: true,
                            }),
                        ],
                        alignment: "center", // Centrar el texto
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "ADMINISTRADORA ÚNICA DE LA EMPRESA",
                                bold: true,
                            }),
                        ],
                        alignment: "center", // Centrar el texto
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "OPERADORA DE SERVICIOS ADMINISTRATIVOS",
                                bold: true,
                            }),
                        ],
                        alignment: "center", // Centrar el texto
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: "BENFUEN S.A. DE C.V.",
                                bold: true,
                            }),
                        ],
                        alignment: "center", // Centrar el texto
                    }),
                ],
            },
        ],
    });

    // Generar el archivo Word
    Packer.toBlob(doc).then((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Cotizacion_BENFUEN.docx';
        link.click();
    }); 
};

export default createWordDocument;