import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFDisplay = ({ currentForm, nextForm, prevForm }) => {
  if (!currentForm) return null;
  return (
    <div className="pdf-container">
      <h3>{currentForm.title}</h3>
      <p>
        {new Date(currentForm.startDate).toLocaleDateString()} –{' '}
        {new Date(currentForm.endDate).toLocaleDateString()}
      </p>
      <div className="pdf-wrapper">
        <button className="pdf-button left" onClick={prevForm}>
          ← Previous
        </button>
        <Document
          file={currentForm.fileUrl}
          key={currentForm._id}
          onLoadError={console.error}
        >
          <Page
            pageNumber={1}
            width={700}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
        <button className="pdf-button right" onClick={nextForm}>
          Next →
        </button>
      </div>
    </div>
  );
};

export default PDFDisplay;