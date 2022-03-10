import { Button, Col, Row, Slider, Space, Typography } from 'antd';
import { useEffect, useState } from 'react';
import {
    RightOutlined,
    LeftOutlined,
    QuestionOutlined,
    ArrowRightOutlined,
    ArrowDownOutlined,
    ArrowUpOutlined,
} from '@ant-design/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import { useSelector } from 'react-redux';
import store from '../../store';
import { changeDocumentPageAction } from '../../actions/meetingActions';
import Socket from '../../utils/webSocket';
import { sendHandsup, sendReaction } from '../../utils/webSocketUtils';
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { Text } = Typography;

type Props = {
    socket: Socket;
    ModeratorMsgSocket: any;
    documentId: number;
    documentUrl: string;
};

function PdfViewerComponent(props: Props) {
    const userId = useSelector((state: any) => state.userReducer.userid);
    const presenterIdNow = useSelector((state: any) => state.meetingReducer.presenterIdNow);
    const documentPageNow = useSelector((state: any) => state.meetingReducer.documentPageNow);

    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(documentPageNow);

    const [width, setWidth] = useState<number | undefined>(0);

    useEffect(() => {
        setWidth(document.getElementById('document_row')?.clientWidth);
    }, []);

    window.addEventListener('resize', () => {
        setWidth(document.getElementById('document_row')?.clientWidth);
    });

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

    /* 挙手ボタン ********************************************************/

    const [isHandsup, setIsHandsup] = useState(false);
    const [handsupDocumentIdNow, setHandsupDocumentIdNow] = useState(0); // 今あげている挙手のdocumentId
    const [handsupDocumentPageNow, setHandsupDocumentPageNow] = useState(0); // 今あげている挙手のdocumentPage
    const [handsupBottonType, setHandsupBottonType] = useState<
        'primary' | 'default' | 'link' | 'text' | 'ghost' | 'dashed' | undefined
    >('primary');
    const [handsupBottonIcon, setHandsupBottonIcon] = useState(<ArrowUpOutlined />);
    const [handsupText, setHandsupText] = useState('手を挙げる');

    const onClickHansup = () => {
        if (!isHandsup) {
            // 手を挙げたら
            handleHandsup();
        } else {
            handleHandsdown(true);
        }
    };

    const handleHandsup = () => {
        sendHandsup(props.socket, userId, props.documentId, documentPageNow, true);
        setHandsupDocumentIdNow(props.documentId);
        setHandsupDocumentPageNow(documentPageNow);

        setIsHandsup(true);
        setHandsupBottonType('ghost');
        setHandsupBottonIcon(<ArrowDownOutlined />);
        setHandsupText('手を下ろす');
    };

    const handleHandsdown = (send: boolean) => {
        if (send) {
            sendHandsup(props.socket, userId, handsupDocumentIdNow, handsupDocumentPageNow, false);
        }

        setIsHandsup(false);
        setHandsupBottonType('primary');
        setHandsupBottonIcon(<ArrowUpOutlined />);
        setHandsupText('手を挙げる');
    };

    useEffect(() => {
        if (props.ModeratorMsgSocket && props.ModeratorMsgSocket.userId === userId) {
            // nullでない　かつ　自分が指名された時
            handleHandsdown(false);
        }
    }, [props.ModeratorMsgSocket]);

    /*****************************************************/

    /* わからないボタン ********************************************************/

    const [isReactedPage, setIsReactedPage] = useState(Array(numPages).fill(false)); //どのページにリアクションしているか
    const [reactionBottonType, setReactionBottonType] = useState<
        'primary' | 'default' | 'link' | 'text' | 'ghost' | 'dashed' | undefined
    >('primary');

    const onClickReaction = () => {
        if (!isReactedPage[pageNumber - 1]) {
            handleReactionOn();
        } else {
            handleReactionOff();
        }
    };

    const handleReactionOn = () => {
        sendReaction(props.socket, props.documentId, pageNumber, true);
        const isReactedPage_copy = isReactedPage.slice();
        isReactedPage_copy[pageNumber - 1] = true;
        setIsReactedPage(isReactedPage_copy);

        setReactionBottonType('ghost');
    };

    const handleReactionOff = () => {
        sendReaction(props.socket, props.documentId, pageNumber, false);
        const isReactedPage_copy = isReactedPage.slice();
        isReactedPage_copy[pageNumber - 1] = false;
        setIsReactedPage(isReactedPage_copy);

        setReactionBottonType('primary');
    };

    useEffect(() => {
        if (isReactedPage[pageNumber - 1]) {
            setReactionBottonType('ghost');
        } else {
            setReactionBottonType('primary');
        }
    }, [pageNumber]);

    /*****************************************************/

    return (
        <Space direction="vertical" style={{ width: '100%' }} onWheel={onWheelPageChange}>
            <Row
                id="document_row"
                style={{
                    width: '90%',
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '4%',
                }}
            >
                <Document file={props.documentUrl} onLoadSuccess={onDocumentLoadSuccess}>
                    <Page
                        pageNumber={pageNumber}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                        width={width}
                    />
                </Document>
            </Row>
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
                {/* <Col flex={1} style={{ marginTop: '1%' }}>
                    <Text style={{ marginLeft: '5%' }}>このページに疑問がありますか？</Text>
                </Col> */}
                <Col flex={7}>
                    {/* ここはページ分け疑問ボタン */}
                    <Button
                        type={reactionBottonType}
                        style={{ width: 140 }}
                        icon={<QuestionOutlined />}
                        shape="round"
                        onClick={onClickReaction}
                    >
                        わからない
                    </Button>
                </Col>
                <Col flex={7}>
                    {/* ここは挙手ボタン */}
                    <Button
                        style={{ width: 140 }}
                        shape="round"
                        type={handsupBottonType}
                        icon={handsupBottonIcon}
                        onClick={onClickHansup}
                    >
                        {handsupText}
                    </Button>
                </Col>
            </Row>
        </Space>
    );
}
export default PdfViewerComponent;
