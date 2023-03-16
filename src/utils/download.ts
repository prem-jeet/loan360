export const downloadAsPDF = (pdfTemplate: any) => {
  setTimeout(() => {
    const myWindow = window.open('', '', 'width=1000,height=700');
    const templateContent = pdfTemplate;
    myWindow?.document.write(templateContent);
    myWindow?.document.close();
    myWindow?.focus();
    myWindow?.print();
    myWindow?.close();
  }, 500);
};
