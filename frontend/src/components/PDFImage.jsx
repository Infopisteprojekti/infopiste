import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PDFImage = ({ form, preview }) => {
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
                width={preview ? 150 : 700}
                renderTextLayer={false}
                renderAnnotationLayer={false}
            />
        </Document>
    )
}

export default PDFImage