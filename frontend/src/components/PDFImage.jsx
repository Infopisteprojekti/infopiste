import { Document, Page, pdfjs } from 'react-pdf';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

pdfjs.GlobalWorkerOptions.workerSrc = pdfjs.GlobalWorkerOptions.workerSrc =
  new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const PDFImage = ({ form, preview }) => {
  const [allPages, setPages] = useState(null);

  const { t } = useTranslation();

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
        loading={<div className="pdf-loading">{t('pdfdisplay.loading')}</div>}
      >
        {allPages &&
          Array.from({ length: allPages < 6 ? allPages : 5 }, (_, i) => (
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
