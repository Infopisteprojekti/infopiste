import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFImage = ({ form, preview }) => {
  const [allPages, setPages] = useState(null);

  if (preview) {
    return (
      <Document
        file={form.fileUrl}
        key={form._id}
        onLoadError={err => {
          console.error(err);
        }}
      >
        <Page
          pageNumber={1}
          width={150}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </Document>
    );
  }

  if (!form || !form.fileUrl) return null;

  return (
    <div className={`pdf-image-container`}>
      <Document
        file={form.fileUrl}
        key={form._id || form.fileUrl}
        onLoadError={err => console.error('PDF load error', err)}
        onLoadSuccess={({ numPages }) => setPages(numPages)}
        loading={<div className="pdf-loading">Loading PDF…</div>}
      >
        {allPages &&
          Array.from({ length: allPages }, (_, i) => (
            <div
              className="pdf-page-wrapper"
              key={`${form._id || form.fileUrl}-p${i + 1}`}
            >
              <Page
                pageNumber={i + 1}
                width={700}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </div>
          ))}
      </Document>
    </div>
  );
};

export default PDFImage;
