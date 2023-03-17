export const downloadAsPDF = (id: string) => {
  const pdfTemplate = document.getElementById(id);
  const pdfWindow = window.open('', '', 'width=1000,height=700');
  pdfWindow?.document.write(pdfTemplate!.innerHTML);
  pdfWindow?.document.close();
  pdfWindow?.focus();
  pdfWindow?.print();
  pdfWindow?.close();
};
