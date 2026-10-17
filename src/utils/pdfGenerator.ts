import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function generateNewspaperPDF(elementId: string, filename: string): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Printable element #${elementId} not found`);
  }

  // Ensure element is visible for capture
  const originalDisplay = element.style.display;
  element.style.display = 'block';

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // 2x resolution for crisp print serifs
      useCORS: true,
      logging: false,
      backgroundColor: '#fbf9f4' // authentic newsprint cream
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / pdfWidth;
    const imgHeightInPdf = canvasHeight / ratio;

    let heightLeft = imgHeightInPdf;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInPdf, undefined, 'FAST');
    heightLeft -= pdfHeight;

    // Add subsequent pages if content overflows
    while (heightLeft > 0) {
      position = heightLeft - imgHeightInPdf;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgHeightInPdf, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    pdf.save(`${filename}.pdf`);
  } finally {
    element.style.display = originalDisplay;
  }
}
