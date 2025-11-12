import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { useTranslation } from 'react-i18next';
import '../styles/components/PDFDisplay.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFDisplay = ({
  currentForm,
  nextForm,
  prevForm,
  preview = false,
  rotateCallBack,
  automaticRotation,
  backCallBack,
}) => {
  const { t } = useTranslation();
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    setPdfLoaded(false);
    setPdfError(false);
  }, [currentForm]);

  if (!currentForm) return null;

  return (
    <div className={`pdf-container ${preview ? 'preview' : ''}`}>
      {!preview && (
        <>
        <div className="pdf-header">
          <button onClick={backCallBack} className="button">
            {t('bulletinboard.back')}
          </button>
          <h2>{currentForm.title}</h2>
          <button onClick={rotateCallBack} className="button">
            {automaticRotation
              ? t('bulletinboard.stop-rotation')
              : t('bulletinboard.continue-rotation')}
          </button>
        </div>
        <p>
          {new Date(currentForm.startDate).toLocaleDateString()} –{' '}
          {new Date(currentForm.endDate).toLocaleDateString()}
        </p>
        </>
      )}
      <div className="pdf-wrapper-with-buttons">
        {!preview && pdfLoaded && (
          <>
            <button className="button pdf-nav-button" onClick={prevForm}>
              ← {t('pdfdisplay.previous')}
            </button>
          </>
        )}
        <div className="pdf-wrapper">
          <Document
            file={currentForm.fileUrl}
            key={currentForm._id}
            onLoadError={err => {
              console.error(err);
              setPdfError(true);
            }}
            onLoadSuccess={() => setPdfLoaded(true)}
          >
            <Page
              pageNumber={1}
              width={preview ? 150 : 700}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
        {!preview && pdfLoaded && !pdfError && (
          <>
            <button className="button pdf-nav-button" onClick={nextForm}>
              {t('pdfdisplay.next')} →
            </button>
          </>
        )}
        {!preview && pdfError && (
          <div className="pdf-error-wrapper">
            <button className="button pdf-nav-button" onClick={prevForm}>
              ← {t('pdfdisplay.previous')}
            </button>
            <button className="button pdf-nav-button" onClick={nextForm}>
              {t('pdfdisplay.next')} →
            </button>
          </div>
        )}
      </div>
      {preview && (
        <div className="pdf-info">
          <h4>{currentForm.title}</h4>
        </div>
      )}
    </div>
  );
};

export default PDFDisplay;
