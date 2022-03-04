import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

function PdfViewerComponent() {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({numPages}: any) {
        setNumPages(numPages);
    }

    function changePage(offset: number) {
        if(pageNumber + offset > 0 && pageNumber + offset <= numPages) {
            setPageNumber(prevPageNumber => prevPageNumber + offset);
        }
    }

    return (
        <div>
            <Document
                file={"https://arxiv.org/pdf/2110.05086.pdf"}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page pageNumber={pageNumber} />
            </Document>
            <p>Page {pageNumber} of {numPages}</p>
            <button onClick={() => changePage(-1)}>Previous Page</button>
            <button onClick={() => changePage(1)}>Next Page</button>
        </div>
    );
}
export default PdfViewerComponent;