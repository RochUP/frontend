import { Button, Space } from 'antd';
import { useEffect, useState } from 'react';
import {
    RightOutlined,
    LeftOutlined,
} from '@ant-design/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import { useSelector } from 'react-redux';
import store from '../../store';
import { changeDocumentPageAction } from '../../actions/meetingActions';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


function PdfViewerComponent() {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);

    const presenterIds = useSelector((state: any) => state.meetingReducer.presenterIds);
    const documentUrls = useSelector((state: any) => state.meetingReducer.documentUrls);
    const presenterIdNow = useSelector((state: any) => state.meetingReducer.presenterIdNow);
    const documentUrlNow = documentUrls[presenterIds.indexOf(presenterIdNow)];
    const documentPageNow = useSelector((state: any) => state.meetingReducer.documentPageNow);

    useEffect(() => {
        setPageNumber(documentPageNow);
    }, [documentPageNow]);

    function onDocumentLoadSuccess({numPages}: any) {
        setNumPages(numPages);
    }

    function changePage(offset: number) {
        if(pageNumber + offset > 0 && pageNumber + offset <= numPages) {
            setPageNumber(prevPageNumber => prevPageNumber + offset);
            store.dispatch(changeDocumentPageAction(presenterIdNow, pageNumber + offset));
        }
    }

    return (
        <Space direction='vertical' style={{width:'100%'}}>
            <Document
                file={documentUrlNow}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page 
                    height={320}
                    pageNumber={pageNumber}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    // rotate={90}
                    />
            </Document>
            <Space style={{display:'flex', justifyContent:'center'}}>
                <Button shape='circle' icon={<LeftOutlined />} onClick={() => changePage(-1)}></Button>
                <p>Page {pageNumber} of {numPages}</p>
                <Button shape='circle' icon={<RightOutlined />} onClick={() => changePage(1)}></Button>
            </Space>
        </Space>
    );
}
export default PdfViewerComponent;