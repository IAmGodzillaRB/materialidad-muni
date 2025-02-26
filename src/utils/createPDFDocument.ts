import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

const createPDFDocument = async () => {
    // Crear un nuevo documento PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    // Configurar la fuente
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Agregar contenido al PDF
    page.drawText("Oaxaca de Juárez, Oaxaca; a 06 de enero de 2022.", {
        x: 50,
        y: 750,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("ASUNTO: COTIZACIÓN", {
        x: 50,
        y: 730,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("COMITÉ DE ADQUISICIONES, ENAJENACIONES, ARRENDAMIENTOS,", {
        x: 50,
        y: 710,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("PRESTACIÓN DE SERVICIOS Y ADMINISTRACIÓN DE BIENES", {
        x: 50,
        y: 690,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("MUEBLES E INMUEBLES PARA EL EJERCICIO FISCAL DOS", {
        x: 50,
        y: 670,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("MIL VEINTITRÉS DEL MUNICIPIO DE SANTA CRUZ AMILPAS,", {
        x: 50,
        y: 650,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("DISTRITO CENTRO, OAXACA.", {
        x: 50,
        y: 630,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("PRESENTE.", {
        x: 50,
        y: 610,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("Por este medio presento la cotización solicitada a \"Operadora de Servicios Administrativos BENFUEN, S.A. de C.V.\" consistente en los Servicios que contemplan en la Invitación con fecha de 04 de enero de 2022:", {
        x: 50,
        y: 590,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("Elaboración Reglamento de Mercados y Comercio en la Vía Publica, con las siguientes obligaciones:", {
        x: 50,
        y: 570,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("CANTIDAD                CONCEPTO              SUBTOTAL", {
        x: 50,
        y: 550,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("1        Reglamento de Mercados y Comercio en la Vía Publica        \$73,275.86", {
        x: 50,
        y: 530,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("I.VA. 16.00%        \$11,724.14", {
        x: 50,
        y: 510,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("TOTAL        \$85,000.00", {
        x: 50,
        y: 490,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("La prestación del servicio tiene un costo total de \$85,000.00 (Ochenta y cinco mil pesos 00/100 M.N.), IVA incluido.", {
        x: 50,
        y: 470,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("Lo anterior, para su conocimiento y ponernos a su servicio.", {
        x: 50,
        y: 450,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("A T E N T A M E N T E", {
        x: 50,
        y: 430,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("C. ELIZABETH MONSERRAT LÓPEZ VÁSQUEZ", {
        x: 50,
        y: 410,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("ADMINISTRADORA ÚNICA DE LA EMPRESA", {
        x: 50,
        y: 390,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("OPERADORA DE SERVICIOS ADMINISTRATIVOS", {
        x: 50,
        y: 370,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    page.drawText("BENFUEN S.A. DE C.V.", {
        x: 50,
        y: 350,
        size: 12,
        font,
        color: rgb(0, 0, 0),
    });

    // Guardar el PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Cotizacion_BENFUEN.pdf';
    link.click();
};

export default createPDFDocument;