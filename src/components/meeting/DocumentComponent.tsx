import { Card, Col, Row, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getDocumentAction } from '../../actions/meetingActions';

import PdfViewerComponent from '../../components/meeting/PdfViewerComponent';
import store from '../../store';
import { getDocument } from '../../utils/api';

type Props = {
    socket: any;
    presenterId: string;
    index: number;
};

export default function DocumentComponent(props: Props) {
    const documentIds = useSelector((state: any) => state.meetingReducer.documentIds);
    const documentPageNow = useSelector((state: any) => state.meetingReducer.documentPageNow);

    const documentUrls = useSelector((state: any) => state.meetingReducer.documentUrls);
    const scripts = useSelector((state: any) => state.meetingReducer.scripts);

    const script = scripts[props.index];

    const scriptEachPage = script.split(/\n\n\n+/);
    const [scriptPageNow, setScriptPageNow] = useState(scriptEachPage[documentPageNow - 1]);

    useEffect(() => {
        setScriptPageNow(scriptEachPage[documentPageNow - 1]);
    }, [script]);

    useEffect(() => {
        setScriptPageNow(scriptEachPage[documentPageNow - 1]);
    }, [documentPageNow]);

    useEffect(() => {
        const documentId = documentIds[props.index];
        (async () => {
            await getDocument(documentId)
                .then((res: any) => {
                    console.log(res);
                    if (!res.result) {
                        throw new Error('Document not found');
                    }
                    store.dispatch(getDocumentAction(documentId, res.documentUrl, res.script));
                })
                .catch((err: any) => {
                    console.log(err);
                });
        })();
    }, [props.socket]);

    return (
        <Card style={{ width: '100%', minHeight: 500, maxHeight: 500 }}>
            <Row>
                <Col span={12}>
                    <PdfViewerComponent documentUrl={documentUrls[props.index]} />
                </Col>
                <Col span={12}>
                    <Typography.Paragraph
                        style={{
                            maxHeight: '450px',
                            textAlign: 'left',
                            whiteSpace: 'pre-line',
                            overflowY: 'auto',
                        }}
                    >
                        {scriptPageNow}
                    </Typography.Paragraph>
                </Col>
            </Row>
        </Card>
    );
}
