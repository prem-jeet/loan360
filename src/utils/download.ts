export const downloadAsPDF = (pdfTemplate: unknown) => {
  if (typeof pdfTemplate === 'string') {
    const pdfWindow = window.open('', '', 'width=1000,height=700');
    const templateContent = pdfTemplate;
    pdfWindow?.document.write(templateContent);
    pdfWindow?.document.close();
    pdfWindow?.focus();
    pdfWindow?.print();
    pdfWindow?.close();
  }
};
