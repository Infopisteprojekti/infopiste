import { Document, Page, pdfjs } from 'react-pdf';
import { useTranslation } from 'react-i18next';
import '../styles/components/PDFDisplay.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFDisplay = ({ currentForm, nextForm, prevForm, preview = false, rotateCallBack, automaticRotation }) => {
  if (!currentForm) return null;

  const {t} = useTranslation();

  return (
    <div className={`pdf-container ${preview ? 'preview' : ''}`}>
      {!preview && (
        <>
          <h2>{currentForm.title}</h2>
          <p>
            {new Date(currentForm.startDate).toLocaleDateString()} –{' '}
            {new Date(currentForm.endDate).toLocaleDateString()}
          </p>
        </>
      )}
      <div className="pdf-wrapper">
        {!preview && (
            <>
            <button onClick={rotateCallBack} className="button" style={{
                position: 'absolute',
                top: '-50px',
                right: '-550px',
                zIndex: 10,
            }}>
              {automaticRotation
                ? t('bulletinboard.stop-rotation')
                : t('bulletinboard.continue-rotation')}
          </button>
            </>
        )}
        {!preview && (
            <>
              <button className="pdf-button left" onClick={prevForm}>
                  ← {t('pdfdisplay.previous')}
              </button>
            </>
        )}
        <Document file={currentForm.fileUrl} key={currentForm._id} onLoadError={console.error}>
          <Page
            pageNumber={1}
            width={preview ? 150 : 700}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            />
        </Document>
        {!preview && (
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