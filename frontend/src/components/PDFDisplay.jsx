import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf';
import { useTranslation } from 'react-i18next';
import '../styles/components/PDFDisplay.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFDisplay = ({ currentForm, nextForm, prevForm, preview = false, rotateCallBack, automaticRotation }) => {
  const {t} = useTranslation();
  const [pdfLoaded, setPdfLoaded] = useState(false);

  useEffect(() => {
    setPdfLoaded(false);
  }, [currentForm]);

  if (!currentForm) return null;  

  return (
    <div className={`pdf-container ${preview ? 'preview' : ''}`}>
      {!preview && (
        <>
          <h2>{currentForm.title}</h2>
          <p>
            {new Date(currentForm.startDate).toLocaleDateString()} –{' '}
            {new Date(currentForm.endDate).toLocaleDateString()}
          </p>
          <button onClick={rotateCallBack} className="button" style={{
            position: 'absolute',
            top: '0px',
            right: '0px',
            zIndex: 10,
          }}>
          {automaticRotation
            ? t('bulletinboard.stop-rotation')
            : t('bulletinboard.continue-rotation')}
          </button>
        </>
      )}
      <div className="pdf-wrapper">
        {!preview && pdfLoaded && (
            <>
              <button className="pdf-button left" onClick={prevForm}>
                  ← {t('pdfdisplay.previous')}
              </button>
            </>
        )}
        <Document file={currentForm.fileUrl} key={currentForm._id} onLoadError={console.error} onLoadSuccess={() => setPdfLoaded(true)}>
          <Page
            pageNumber={1}
            width={preview ? 150 : 700}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            />
        </Document>
        {!preview && pdfLoaded && (
            <>
              <button className="pdf-button right" onClick={nextForm}>
                {t('pdfdisplay.next')} →
              </button>
            </>
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