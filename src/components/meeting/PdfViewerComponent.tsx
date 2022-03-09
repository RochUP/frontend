import { Button, Col, Row, Slider, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import {
    RightOutlined,
    LeftOutlined,
    QuestionOutlined,
    ArrowRightOutlined,
} from '@ant-design/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import { useSelector } from 'react-redux';
import store from '../../store';
import { changeDocumentPageAction } from '../../actions/meetingActions';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { Text } = Typography;

type Props = {
    documentUrl: string;
};

function PdfViewerComponent(props: Props) {
    const presenterIdNow = useSelector((state: any) => state.meetingReducer.presenterIdNow);
    const documentPageNow = useSelector((state: any) => state.meetingReducer.documentPageNow);

    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(documentPageNow);

    useEffect(() => {
        store.dispatch(changeDocumentPageAction(presenterIdNow, pageNumber));
    }, [pageNumber]);

    function onDocumentLoadSuccess({ numPages }: any) {
        setNumPages(numPages);
    }

    function changePage(offset: number) {
        if (pageNumber + offset > 0 && pageNumber + offset <= numPages) {
            setPageNumber(pageNumber + offset);
        }
    }

    function onWheelPageChange(event: any) {
        if (event.deltaY > 0) {
            changePage(1);
        } else {
            changePage(-1);
        }
    }

    return (
        <Space direction="vertical" style={{ width: '100%' }} onWheel={onWheelPageChange}>
            <Document file={props.documentUrl} onLoadSuccess={onDocumentLoadSuccess}>
                <Page
                    height={330}
                    pageNumber={pageNumber}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                />
            </Document>
            <Row
                style={{
                    width: '90%',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '4%',
                }}
            >
                <Col flex={1} style={{ paddingLeft: '10px' }}>
                    <Button shape="circle" icon={<LeftOutlined />} onClick={() => changePage(-1)} />
                </Col>
                <Col flex={30}>
                    <Slider
                        defaultValue={pageNumber}
                        min={1}
                        max={numPages}
                        onChange={(value) => {
                            setPageNumber(value);
                        }}
                        value={pageNumber}
                        style={{ width: '100%' }}
                    />
                </Col>
                <Col flex={1}>
                    <Button
                        shape="circle"
                        icon={<RightOutlined />}
                        onClick={() => changePage(1)}
                        style={{ marginLeft: '80%' }}
                    />
                </Col>
            </Row>
            <Row style={{ marginLeft: '20%' }}>
                <Col flex={1} style={{ marginTop: '1%' }}>
                    <Text style={{ marginLeft: '5%' }}>このページに疑問がありますか？</Text>
                </Col>
                <Col flex={7}>
                    {/* ここはページ分け疑問ボタン */}
                    <Button
                        type="default"
                        style={{ width: 70 }}
                        // icon={<QuestionOutlined />}
                        shape="round"
                    >
                        はい
                    </Button>
                </Col>
            </Row>
        </Space>
    );
}
export default PdfViewerComponent;
