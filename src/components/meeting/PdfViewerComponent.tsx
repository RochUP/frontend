import { Button, Slider, Space } from 'antd';
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


type Props = {
    documentUrl: string;
}

function PdfViewerComponent(props: Props) {


    const presenterIdNow = useSelector((state: any) => state.meetingReducer.presenterIdNow);
    const documentPageNow = useSelector((state: any) => state.meetingReducer.documentPageNow);

    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(documentPageNow);

    useEffect(() => {
        store.dispatch(changeDocumentPageAction(presenterIdNow, pageNumber));
    }, [pageNumber]);

    function onDocumentLoadSuccess({numPages}: any) {
        setNumPages(numPages);
    }

    function changePage(offset: number) {
        if(pageNumber + offset > 0 && pageNumber + offset <= numPages) {
            setPageNumber(pageNumber + offset);
        }
    }

    function onWheelPageChange(event: any) {
        if(event.deltaY > 0) {
            changePage(1);
        } else {
            changePage(-1);
        }
    }


    return (
        <Space direction='vertical' style={{width:'100%'}} onWheel={onWheelPageChange}>
            <Document
                file={props.documentUrl}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page 
                    height={320}
                    pageNumber={pageNumber}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                />
            </Document>
            <Slider defaultValue={pageNumber} min={1} max={numPages} onChange={(value) => {setPageNumber(value);}} value={pageNumber}></Slider>
            <Space style={{display:'flex', justifyContent:'center'}}>
                <Button shape='circle' icon={<LeftOutlined />} onClick={() => changePage(-1)}></Button>
                <p>Page {pageNumber} of {numPages}</p>
                <Button shape='circle' icon={<RightOutlined />} onClick={() => changePage(1)}></Button>
            </Space>
        </Space>
    );
}
export default PdfViewerComponent;